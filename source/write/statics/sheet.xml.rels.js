export default function generateSheetXmlRels({ id, images }) {
	return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
			// Each sheet has at most one "drawing", so a globally-unique drawing ID is assumed to be the sheet ID.
			(images ? `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing${id}.xml"/>` : '') +
		'</Relationships>'
}