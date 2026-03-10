import attributeValue from '../../../xml/escapeAttributeValue.js'
import textContent from '../../../xml/escapeTextContent.js'

// Returns the content that should be inserted by `features` when performing a `transformName` transform.
export default function getAdditionalContent(
	transformName,
	features,
	availableParameters,
	{ multipleSheetsParameters, sheetIndex, sheetId }
) {
	let content = ''
	for (const feature of features) {
		const transform = feature.files && feature.files.transform && feature.files.transform[transformName]
		if (transform && transform.insert) {
			const customParameters = transform.parameters ? transform.parameters(availableParameters) : undefined
			const insertedContent = transform.insert(
				customParameters,
				{ multipleSheetsParameters, sheetIndex, sheetId, attributeValue, textContent }
			)
			if (insertedContent) {
				content += insertedContent
			}
		}
	}
	return content
}