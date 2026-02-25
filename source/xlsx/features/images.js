import $attributeValue from '../../xml/sanitizeAttributeValue.js'
import getFileExtensionForContentType from '../helpers/getFileExtensionForContentType.js'

function normalizeParameters(parameters, { multipleSheetsParameters, sheetIndex }) {
	const { images: imagesParameter } = parameters
	if (imagesParameter) {
		const imagesPerSheet = multipleSheetsParameters ? imagesParameter : [imagesParameter]
		const images = typeof sheetIndex === 'number' ? imagesPerSheet[sheetIndex] : undefined
		return { imagesPerSheet, images }
	}
	return {}
}

export default {
	files: {
		transform: {
			'[Content_Types].xml': {
				insert: (parameters, { multipleSheetsParameters }) => {
					const { imagesPerSheet } = normalizeParameters(parameters, { multipleSheetsParameters })
					if (imagesPerSheet) {
						return getContentTypesXml({ imagesPerSheet })
					}
				},

				// These parameters will be passed through to the function above.
				parameters: (availableParameters) => {
					const { images } = availableParameters
					return { images }
				}
			},

			'xl/drawings/drawing{id}.xml': {
				insert: (parameters, { sheetIndex, multipleSheetsParameters }) => {
					const { images } = normalizeParameters(parameters, { multipleSheetsParameters, sheetIndex })
					if (images) {
						return getImagesDrawingXml({ images })
					}
				},

				// These parameters will be passed through to the function above.
				parameters: (availableParameters) => {
					const { images } = availableParameters
					return { images }
				}
			},

			'xl/drawings/_rels/drawing{id}.xml.rels': {
				insert: (parameters, { sheetIndex, sheetId, multipleSheetsParameters }) => {
					const { images } = normalizeParameters(parameters, { multipleSheetsParameters, sheetIndex })
					if (images) {
						return getImagesDrawingXmlRels({ images, sheetIndex })
					}
				},

				// These parameters will be passed through to the function above.
				parameters: (availableParameters) => {
					const { images } = availableParameters
					return { images }
				}
			}
		},

		write: {
			files: (parameters, { multipleSheetsParameters }) => {
				const { imagesPerSheet } = normalizeParameters(parameters, { multipleSheetsParameters })
				if (imagesPerSheet) {
					return imagesPerSheet.map((sheetImages, sheetIndex) => {
						if (sheetImages) {
							return sheetImages.reduce((sheetFiles, image, imageIndex) => ({
								...sheetFiles,
								[`xl/media/${getImageFileName(image, { sheetIndex, imageIndex })}`]: image.content
							}), {})
						}
						return {}
					}).reduce((allFiles, sheetFiles) => ({
						...allFiles,
						...sheetFiles
					}), {})
				}
			},

			// These parameters will be passed through to the function above.
			parameters: (availableParameters) => {
				const { images } = availableParameters
				return { images }
			}
		}
	}
}

function getContentTypesXml({ imagesPerSheet }) {
	// Get images from all sheets.
	const imagesFromAllSheets = imagesPerSheet.reduce((all, images) => [
		...all,
		...(images || [])
	], [])

	let xml = ''

	// Elements with `PartName="/xl/drawings/drawing${sheetId}.xml"` are already added by default.
	// Hence, this block of code was commented out.
	//
	// let i = 0
	// for (const images of imagesPerSheet) {
	// 	if (images) {
	// 		xml += `<Override ContentType="application/vnd.openxmlformats-officedocument.drawing+xml" PartName="/xl/drawings/drawing${sheetId}.xml"/>`
	// 	}
	// 	i++
	// }

	for (const { fileExtension, contentType } of getFileExtensionContentTypes(imagesFromAllSheets)) {
		xml += `<Default Extension="${fileExtension}" ContentType="${contentType}"/>`
	}

	return xml
}

function getFileExtensionContentTypes(images) {
	const fileExtensionContentTypes = []

	const addFileExtensionContentType = (image) => {
		const fileExtension = getFileExtensionForContentType(image.contentType)
		const existingFileExtensionContentType = fileExtensionContentTypes.find(_ => _.fileExtension === fileExtension)
		if (!existingFileExtensionContentType) {
			fileExtensionContentTypes.push({
				fileExtension,
				contentType: image.contentType
			})
		}
	}

	for (const image of images) {
		addFileExtensionContentType(image)
	}

	return fileExtensionContentTypes
}

function getImageFileName(image, { sheetIndex, imageIndex }) {
	const sheetNumber = sheetIndex + 1
	const imageNumber = imageIndex + 1
	return `sheet${sheetNumber}-image${imageNumber}.${getFileExtensionForContentType(image.contentType)}`
}

function getImagesDrawingXml({ images }) {
	let xml = ''

	let i = 0
	for (const image of images) {
		// `imageId` is used to get the "relationship ID" of the image.
		const imageId = i + 1

		const pxToEmu = (px) => pxToEmu_(px, image.dpi)

		// There're two ways an image could be "anchored" in a spreadsheet:
		// * One-cell anchor — "anchors" the image's top-left corner to a top-left corner of a cell.
		// * Two-cell anchor — "anchors" the image's top-left corner to a top-left corner of the first cell,
		//   and then the image's bottom-right corner to the bottom-right corner of the second cell.
		//   While doing so, it completely ignores the image's aspect ratio, so there seems to be
		//   no equivalent for CSS's `object-fit: contain` behavior.
		xml += '<xdr:oneCellAnchor>'

		xml += '<xdr:from>'
		xml += `<xdr:col>${image.anchor.column - 1}</xdr:col>`
		xml += `<xdr:colOff>${typeof image.offsetX === 'number' ? pxToEmu(image.offsetX) : 0}</xdr:colOff>`
		xml += `<xdr:row>${image.anchor.row - 1}</xdr:row>`
		xml += `<xdr:rowOff>${typeof image.offsetY === 'number' ? pxToEmu(image.offsetY) : 0}</xdr:rowOff>`
		xml += '</xdr:from>'

		xml += `<xdr:ext cx="${pxToEmu(image.width)}" cy="${pxToEmu(image.height)}"/>`

		xml += '<xdr:pic>'

		xml += '<xdr:nvPicPr>'

		xml += `<xdr:cNvPr id="${imageId}" name="${image.title ? $attributeValue(image.title) : 'Picture ' + imageId}" descr="${image.description ? $attributeValue(image.description) : ''}"/>`

		xml += '<xdr:cNvPicPr>'
    // Optional XML element. Locks the aspect ratio of the image. -->
    xml += '<a:picLocks noChangeAspect="1"/>'
		xml += '</xdr:cNvPicPr>'

		xml += '</xdr:nvPicPr>'

		xml += '<xdr:blipFill>';

		// The link to the image.
		xml += `<a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId-image-${imageId}" cstate="print"/>`;

		// Allows scaling the image.
		xml += '<a:stretch>'
		xml += '<a:fillRect/>'
		xml += '</a:stretch>'

		xml += '</xdr:blipFill>'

		// Dunno what this is.
		xml += '<xdr:spPr>'

		xml += '<a:prstGeom prst="rect">'
		xml += '<a:avLst/>'
		xml += '</a:prstGeom>'

		xml += '</xdr:spPr>'

		xml += '</xdr:pic>'

		xml += '<xdr:clientData/>'

		xml += '</xdr:oneCellAnchor>'

		i++
	}

	return xml
}

function getImagesDrawingXmlRels({ images, sheetIndex }) {
	return images.map((image, i) => {
		const imageId = i + 1
		return `<Relationship Id="rId-image-${imageId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/${getImageFileName(image, { sheetIndex, imageIndex: i })}"/>`
	}).join('')
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