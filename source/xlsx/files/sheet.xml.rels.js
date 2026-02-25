import getAdditionalContent from '../helpers/features/getAdditionalContent.js'
import transformContent from '../helpers/features/transformContent.js'

export default function generateSheetXmlRels({
	multipleSheetsParameters,
	sheetIndex,
	sheetId,
	features,
	...restParameters
}) {
	let xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
			// Each sheet has at most one "drawing", so a globally-unique drawing ID is assumed to be the sheet ID.
			getDrawingRelationshipXml(sheetId) +
			// Apply any plugins that insert additional content to this XML.
			getAdditionalContent(
				'xl/worksheets/_rels/sheet{id}.xml.rels',
				features,
				restParameters,
				{ multipleSheetsParameters, sheetIndex, sheetId }
			) +
		'</Relationships>'

	// Apply any plugins that transform this XML.
	xml = transformContent(
		xml,
		'xl/worksheets/_rels/sheet{id}.xml.rels',
		features,
		restParameters,
		{ multipleSheetsParameters, sheetIndex, sheetId }
	)

	return xml
}

export function getDrawingRelationshipXml(sheetId) {
	return `<Relationship Id="rId-drawing-1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing${sheetId}.xml"/>`
}