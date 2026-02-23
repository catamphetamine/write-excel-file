import attributeValue from '../../../xml/sanitizeAttributeValue.js'
import textContent from '../../../xml/sanitizeTextContent.js'

export default function getWrittenFiles(
	features,
	availableParameters,
	{ multipleSheetsParameters, read }
) {
	let writtenFiles = {}

	for (const feature of features) {
		if (feature.files && feature.files.write) {
			if (feature.files.write.files) {
				const customParameters = feature.files.write.parameters ? feature.files.write.parameters(availableParameters) : undefined
				const files = feature.files.write.files(
					customParameters,
					{ multipleSheetsParameters, read, attributeValue, textContent },
				)
				if (files) {
					writtenFiles = {
						...writtenFiles,
						...files
					}
				}
			}
		}
	}

	return writtenFiles
}