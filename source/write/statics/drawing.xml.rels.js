import getImageFileName from '../getImageFileName.js'

export default function generateDrawingXmlRels({
	images = [],
	sheetId
} = {}) {
	return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
			images.map((image, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/${getImageFileName(image, { sheetId, sheetImages: images })}"/>`).join('') +
		'</Relationships>'
}