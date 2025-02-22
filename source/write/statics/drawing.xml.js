import $attr from '../../xml/sanitizeAttributeValue.js'

export default function generateDrawingXml({ images }) {
	let output = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
		'<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'

	let i = 0
	for (const image of images) {
		// The `rId` of the image in `drawing.xml.rels` file.
		const imageId = i + 1

		output += '<xdr:oneCellAnchor>'

		output += '<xdr:from>'
		output += `<xdr:col>${image.anchor.column - 1}</xdr:col>`
		output += `<xdr:colOff>${typeof image.offsetX == 'number' ? pxToEmu(image.offsetX) : 0}</xdr:colOff>`
		output += `<xdr:row>${image.anchor.row - 1}</xdr:row>`
		output += `<xdr:rowOff>${typeof image.offsetY == 'number' ? pxToEmu(image.offsetY) : 0}</xdr:rowOff>`
		output += '</xdr:from>'

		output += `<xdr:ext cx="${pxToEmu(image.width)}" cy="${pxToEmu(image.height)}"/>`

		output += '<xdr:pic>'

		output += '<xdr:nvPicPr>'

		output += `<xdr:cNvPr id="${i}" name="${image.title ? $attr(image.title) : 'Picture ' + imageId}" descr="${image.description ? $attr(image.description) : ''}"/>`

		output += '<xdr:cNvPicPr>'
    // Optional XML element. Locks the aspect ratio of the image. -->
    output += '<a:picLocks noChangeAspect="1"/>'
		output += '</xdr:cNvPicPr>'

		output += '</xdr:nvPicPr>'

		// Dunno what this is.
		output += '<xdr:blipFill>';
		output += `<a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId${imageId}" cstate="print"/>`;
		output += '</xdr:blipFill>'

		// Dunno what this is.
		output += '<xdr:spPr>'
		output += '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>'
		output += '</xdr:spPr>'

		output += '</xdr:pic>'

		output += '<xdr:clientData/>';

		output += '</xdr:oneCellAnchor>';

		i++;
	}

	output += '</xdr:wsDr>';

	return output;
}

// Converts pixels to EMU units.
// See `docs/IMAGES.md` for more info.
function pxToEmu(px) {
	return px * 9525
}