Microsoft Information Protection (MIP) ["sensitivity labels"](https://learn.microsoft.com/en-us/purview/sensitivity-labels) could be used to assign a certain confidentiality level to a given document.

This example shows how to implement a "feature" that adds such "sensitivity label" to an output `.xlsx` file.

Originally submitted as a [pull request](https://gitlab.com/catamphetamine/write-excel-file/-/merge_requests/8) by [Paul-Alexandre Fourrière](https://gitlab.com/pa1007). Also see a very much same [answer](https://github.com/exceljs/exceljs/discussions/2085#discussioncomment-12924424) by [LukeyBeachBoy](https://github.com/LukeyBeachBoy) that adds the same feature in a different package.

## Sensitivity Label Definition

First, define a list of sensitivity labels that should be applied to the document in a separate `.xml` file:

```xml
<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<clbl:labelList xmlns:clbl="http://schemas.microsoft.com/office/2020/mipLabelMetadata">
	<clbl:label
		id="${sensitivityLabelId}"
		siteId="${sensitivityLabelSiteId}"
		method="${sensitivityLabelAssignmentMethod}"
		contentBits="${sensitivityLabelContentBits}"
		enabled="1"
		removed="0" />
</clbl:labelList>
```

## Sensitivity Label Content Type

Then add an `<Override/>` element for that new `.xml` file in `[Content_Types].xml` file:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
	...
	<Override ContentType="application/vnd.ms-office.classificationlabels+xml" PartName="/${sensitivityLabelsDefinitionFilePath}"/>
</Types>
```

## Sensitivity Label Relationship

Finally, establish a "relationship" between the document and the sensitivity labels in `_rels/.rels` file:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
	...
	<Relationship Id="rId${relationshipId}" Type="http://schemas.microsoft.com/office/2020/02/relationships/classificationlabels" Target="${sensitivityLabelsDefinitionFilePath}"/>
</Relationships>
```

## Feature Implementation

The above XML modifications could be implemented as the following custom "feature":

```js
// Constants.
const sensitivityLabelsDefinitionFilePath = 'docMetadata/LabelInfo.xml'
const sensitivityLabelsRelationshipId = 'rId-sensitivityLabels-1'

// Returns the list of the new parameters that this feature introduces.
const getFeatureParameters = (allParameters) => {
	const {
		sensitivityLabelId,
		sensitivityLabelSiteId,
		sensitivityLabelAssignmentMethod,
		sensitivityLabelContentBits
	} = allParameters

	return {
		sensitivityLabelId,
		sensitivityLabelSiteId,
		sensitivityLabelAssignmentMethod,
		sensitivityLabelContentBits
	}
}

const sensitivityLabelsFeature = {
	// Describes the files that this feature will transform or write.
	files: {
		// Describes the files that this feature will transform.
		transform: {
			// This feature will transform "[Content_Types].xml" file.
			'[Content_Types].xml': {
				// It will insert additional XML markup inside the root element.
				insert: ({ sensitivityLabelId, sensitivityLabelSiteId, sensitivityLabelAssignmentMethod, sensitivityLabelContentBits }, { attributeValue, textContent }) => {
					// If `sensitivityLabelId` parameter is passed.
					if (sensitivityLabelId) {
						// Return the additional XML markup that will be inserted inside the root element.
						return `<Override ContentType="application/vnd.ms-office.classificationlabels+xml" PartName="/${sensitivityLabelsDefinitionFilePath}"/>`
					}
				},

				// Returns the list of the new parameters that this feature introduces.
				parameters: getFeatureParameters
			},

			// This feature will transform "_rels/.rels" file.
			'_rels/.rels': {
				// It will insert additional XML markup inside the root element.
				insert: ({ sensitivityLabelId, sensitivityLabelSiteId, sensitivityLabelAssignmentMethod, sensitivityLabelContentBits }, { attributeValue, textContent }) => {
					// If `sensitivityLabelId` parameter is passed.
					if (sensitivityLabelId) {
						// Return the additional XML markup that will be inserted inside the root element.
						return `<Relationship Id="${sensitivityLabelsRelationshipId}" Type="http://schemas.microsoft.com/office/2020/02/relationships/classificationlabels" Target="${sensitivityLabelsDefinitionFilePath}"/>`
					}
				},

				// Returns the list of the new parameters that this feature introduces.
				parameters: getFeatureParameters
			}
		},

		// Describes the files that this feature will write.
		write: {
			// It will write some "global" files, i.e. ones that're shared between all sheets.
			files: ({ sensitivityLabelId, sensitivityLabelSiteId, sensitivityLabelAssignmentMethod, sensitivityLabelContentBits }, { read, attributeValue, textContent }) => {
				// If `sensitivityLabelId` parameter is passed.
				if (sensitivityLabelId) {
					// Validate `sensitivityLabelSiteId` parameter value.
					if (!sensitivityLabelSiteId) {
						throw new Error('When `sensitivityLabelId` parameter is specified, `sensitivityLabelSiteId` parameter must be specified too')
					}
					// Validate `sensitivityLabelContentBits` parameter value.
					if (sensitivityLabelContentBits !== undefined && typeof sensitivityLabelContentBits !== 'number') {
						throw new Error('When `sensitivityLabelContentBits` parameter is specified, it should be a number')
					}
					// Return the list of "global" files that will be written.
					return {
						[sensitivityLabelsDefinitionFilePath]:
							'<?xml version="1.0" encoding="utf-8" standalone="yes"?>' +
							'<clbl:labelList xmlns:clbl="http://schemas.microsoft.com/office/2020/mipLabelMetadata">' +
								`<clbl:label id="${attributeValue(sensitivityLabelId)}" siteId="${attributeValue(sensitivityLabelSiteId)}" method="${attributeValue(sensitivityLabelAssignmentMethod || 'Privileged')}" contentBits="${attributeValue(String(sensitivityLabelContentBits || 0))}" enabled="1" removed="0" />` +
							'</clbl:labelList>'
					}
				}
			},

			// Returns the list of the new parameters that this feature introduces.
			parameters: getFeatureParameters
		}
	}
}

// An example of using this feature.
await writeXlsxFile(data, {
	// Use the sensitivity labels feature.
	features: [sensitivityLabelsFeature],

	// The unique GUID (Globally Unique Identifier) of the sensitivity label itself,
	// which is specific to an organization's Microsoft Purview configuration.
	//
	// Common Sensitivity Label ID Examples (based on Microsoft Information Protection examples):
  // * Personal: 73c47c6a-eb00-4a6a-8e19-efaada66dee6
  // * Public: 73254501-3d5b-4426-979a-657881dfcb1e
  // * General: da480625-e536-430a-9a9e-028d16a29c59
  // * Confidential: 569af77e-61ea-4deb-b7e6-79dc73653959
  // * Highly Confidential: 905845d6-b548-439c-9ce5-73b2e06be157
	//
	sensitivityLabelId: '569af77e-61ea-4deb-b7e6-79dc73653959',

	// Site ID is a unique identifier (GUID) for your organization's Microsoft 365 tenant,
	// required to enforce policy persistence and identify the label's source.
	// Example: "5f0d8a9b-e21a-4c4c-87d2-7c9d3f1a2b3c".
	sensitivityLabelSiteId: '5f0d8a9b-e21a-4c4c-87d2-7c9d3f1a2b3c',

	// The manner in which the label was assugned (e.g., manual, automatic, recommended).
	//
	// The possible values correspond to the `MsoAssignmentMethod` enumeration in Office programming interfaces and can be one of the following:
	// * standard — The label was manually applied by a user.
	// * privileged — The label was applied as a result of a privileged operation (e.g., by an administrator or a specific process).
	// * auto — The label was automatically applied by an auto-labeling policy based on content inspection.
	// * unknownFutureValue —  A placeholder for future assignment methods.
	//
	sensitivityLabelAssignmentMethod: 'Privileged',

	// The human-readable name of the sensitivity label (e.g., "Confidential", "Public").
	// Translates into `name` XML attribute.
	// sensitivityLabelName: ...

	// The timestamp of when the label was applied or last modified.
	// Translates into `setDate` XML attribute.
	// sensitivityLabelSetDate: ...

	// A unique identifier for the specific protective action (e.g., encryption settings) associated with the label.
	// Translates into `actionId` XML attribute.
	// Example: "d601b072-68b2-4d2a-a92e-9d2432e0e02c".
	// sensitivityLabelActionId: ...

	// An integer value representing the type of protection applied to the content (e.g., encryption).
	// Common ContentBits examples:
	// * 0 (no protection)
	// * 2 (encryption applied)
	// * 8 (content markings applied)
	// * combinations like 10 (encryption + marking)
	sensitivityLabelContentBits: 0
})
```