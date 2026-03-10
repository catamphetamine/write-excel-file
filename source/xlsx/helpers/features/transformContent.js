import attributeValue from '../../../xml/escapeAttributeValue.js'
import textContent from '../../../xml/escapeTextContent.js'

// Transforms the content by `features` when performing a `transformName` transform.
export default function transformContent(
	content,
	transformName,
	features,
	availableParameters,
	{ multipleSheetsParameters, sheetIndex, sheetId }
) {
	for (const feature of features) {
		const transform = feature.files && feature.files.transform && feature.files.transform[transformName]
		if (transform && transform.transform) {
			const customParameters = transform.parameters ? transform.parameters(availableParameters) : undefined
			content = transform.transform(
				content,
				customParameters,
				{ multipleSheetsParameters, sheetIndex, sheetId, attributeValue, textContent },
			)
		}
	}
	return content
}