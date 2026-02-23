import getAdditionalContent from '../helpers/features/getAdditionalContent.js'
import transformContent from '../helpers/features/transformContent.js'

export default function generateDrawingXmlRels({
	multipleSheetsParameters,
	sheetIndex,
	sheetId,
	features,
	...restParameters
}) {
	let xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
			// Apply any plugins that insert additional content to this XML.
			getAdditionalContent(
				'xl/drawings/_rels/drawing{id}.xml.rels',
				features,
				restParameters,
				{ multipleSheetsParameters, sheetIndex, sheetId }
			) +
		'</Relationships>'

	// Apply any plugins that transform this XML.
	xml = transformContent(
		xml,
		'xl/drawings/_rels/drawing{id}.xml.rels',
		features,
		restParameters,
		{ multipleSheetsParameters, sheetIndex, sheetId }
	)

	return xml
}