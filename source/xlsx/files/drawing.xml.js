import getAdditionalContent from '../helpers/features/getAdditionalContent.js'
import transformContent from '../helpers/features/transformContent.js'

// https://gitlab.com/catamphetamine/write-excel-file/-/blob/main/docs/IMAGES.md
export default function generateDrawingXml({
	sheetIndex,
	sheetId,
	sheetOptions,
	features
}) {
	let xml =
		DRAWING_XML_START +
			// Apply any plugins that insert additional content to this XML.
			getAdditionalContent(
				'xl/drawings/drawing{id}.xml',
				features,
				sheetOptions,
				{ sheetIndex, sheetId }
			) +
		DRAWING_XML_END

	// Apply any plugins that transform this XML.
	xml = transformContent(
		xml,
		'xl/drawings/drawing{id}.xml',
		features,
		sheetOptions,
		{ sheetIndex, sheetId }
	)

	return xml
}

export const DRAWING_XML_START =
	'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
	'<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'

export const DRAWING_XML_END = '</xdr:wsDr>'