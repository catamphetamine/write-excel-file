import getAdditionalContent from '../helpers/features/getAdditionalContent.js'
import transformContent from '../helpers/features/transformContent.js'

export default function generateRelsXml({
	multipleSheetsParameters,
	features,
	...restParameters
}) {
	let xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
			'<Relationship Id="rId-workbook-1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
			// Apply any plugins that insert additional content to this XML.
			getAdditionalContent(
				'_rels/.rels',
				features,
				restParameters,
				{ multipleSheetsParameters }
			) +
		'</Relationships>'

	// Apply any plugins that transform this XML.
	xml = transformContent(
		xml,
		'_rels/.rels',
		features,
		restParameters,
		{ multipleSheetsParameters }
	)

	return xml
}