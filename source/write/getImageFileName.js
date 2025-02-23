import getFileExtensionForContentType from './getFileExtensionForContentType.js'

//
export default function getImageFileName(image, { sheetId, sheetImages }) {
	return `sheet${sheetId}-image${sheetImages.indexOf(image) + 1}.${getFileExtensionForContentType(image.contentType)}`
}