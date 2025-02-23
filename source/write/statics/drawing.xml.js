import $attr from '../../xml/sanitizeAttributeValue.js'

export default function generateDrawingXml({ images }) {
	let output = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
		'<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'

	let i = 0
	for (const image of images) {
		// The `rId` of the image in `drawing.xml.rels` file.
		const imageId = i + 1

		const pxToEmu = (px) => pxToEmu_(px, image.dpi)

		output += '<xdr:oneCellAnchor>'

		output += '<xdr:from>'
		output += `<xdr:col>${image.anchor.column - 1}</xdr:col>`
		output += `<xdr:colOff>${typeof image.offsetX === 'number' ? pxToEmu(image.offsetX) : 0}</xdr:colOff>`
		output += `<xdr:row>${image.anchor.row - 1}</xdr:row>`
		output += `<xdr:rowOff>${typeof image.offsetY === 'number' ? pxToEmu(image.offsetY) : 0}</xdr:rowOff>`
		output += '</xdr:from>'

		output += `<xdr:ext cx="${pxToEmu(image.width)}" cy="${pxToEmu(image.height)}"/>`

		output += '<xdr:pic>'

		output += '<xdr:nvPicPr>'

		output += `<xdr:cNvPr id="${imageId}" name="${image.title ? $attr(image.title) : 'Picture ' + imageId}" descr="${image.description ? $attr(image.description) : ''}"/>`

		output += '<xdr:cNvPicPr>'
    // Optional XML element. Locks the aspect ratio of the image. -->
    output += '<a:picLocks noChangeAspect="1"/>'
		output += '</xdr:cNvPicPr>'

		output += '</xdr:nvPicPr>'

		output += '<xdr:blipFill>';

		// The link to the image.
		output += `<a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId${imageId}" cstate="print"/>`;

		// Allows scaling the image.
		output += '<a:stretch>'
		output += '<a:fillRect/>'
		output += '</a:stretch>'

		output += '</xdr:blipFill>'

		// Dunno what this is.
		output += '<xdr:spPr>'

		output += '<a:prstGeom prst="rect">'
		output += '<a:avLst/>'
		output += '</a:prstGeom>'

		output += '</xdr:spPr>'

		output += '</xdr:pic>'

		output += '<xdr:clientData/>';

		output += '</xdr:oneCellAnchor>';

		i++;
	}

	output += '</xdr:wsDr>';

	return output;
}

// For legacy reasons, XLSX documents measure image dimensions not in pixels
// but rather in a weird measurement unit called EMU (English Metric Unit).
// https://gitlab.com/catamphetamine/write-excel-file/-/blob/main/docs/IMAGES.md#image-dimensions
// This function converts pixels to EMUs.
const DEFAULT_DISPLAY_DPI = 96
const DEFAULT_IMAGE_DPI = 96
function pxToEmu_(px, imageDpi) {
	const displayDpi = DEFAULT_DISPLAY_DPI
	return Math.round(px * 9525 * (DEFAULT_DISPLAY_DPI / displayDpi) * (DEFAULT_IMAGE_DPI / imageDpi))
}