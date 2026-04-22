import getAdditionalContent from '../helpers/features/getAdditionalContent.js'
import transformContent from '../helpers/features/transformContent.js'

export default function generateContentTypesXml({
	sheetIds,
	features,
	sheetsOptions
}) {
	let xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
		'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
			'<Default ContentType="application/xml" Extension="xml"/>' +
			'<Default ContentType="application/vnd.openxmlformats-package.relationships+xml" Extension="rels"/>' +
			'<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" PartName="/xl/workbook.xml"/>' +
			'<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml" PartName="/xl/sharedStrings.xml"/>' +
			'<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" PartName="/xl/styles.xml"/>' +
			sheetIds.map(sheetId => `<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" PartName="/xl/worksheets/sheet${sheetId}.xml"/>`).join('') +
			sheetIds.map(sheetId => getDrawingContentTypeXml(sheetId)).join('') +
			// Apply any plugins that insert additional content to this XML.
			getAdditionalContent(
				'[Content_Types].xml',
				features,
				sheetsOptions
			) +
		'</Types>'

	// Apply any plugins that transform this XML.
	xml = transformContent(
		xml,
		'[Content_Types].xml',
		features,
		sheetsOptions
	)

	return xml
}

export function getDrawingContentTypeXml(sheetId) {
	return `<Override ContentType="application/vnd.openxmlformats-officedocument.drawing+xml" PartName="/xl/drawings/drawing${sheetId}.xml"/>`
}