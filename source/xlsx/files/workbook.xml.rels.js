import getAdditionalContent from '../helpers/features/getAdditionalContent.js'
import transformContent from '../helpers/features/transformContent.js'

export default function generateWorkbookXmlRels({
	sheetIds,
	features,
	sheetsOptions
}) {
	let xml = '<?xml version="1.0" ?>' +
		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
			sheetIds.map(id => `<Relationship Id="rId${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${id}.xml"/>`).join('') +
			`<Relationship Id="rId${sheetIds.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>` +
			`<Relationship Id="rId${sheetIds.length + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
			// Apply any plugins that insert additional content to this XML.
			getAdditionalContent(
				'xl/workbook.xml',
				features,
				sheetsOptions
			) +
		'</Relationships>'

	// Apply any plugins that transform this XML.
	xml = transformContent(
		xml,
		'xl/workbook.xml',
		features,
		sheetsOptions
	)

	return xml
}