import getFileExtensionForContentType from '../getFileExtensionForContentType.js'

// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/statics/%5BContent_Types%5D.xml.js

export default function generateContentTypesXml({ images, sheets }) {
	return '<?xml version="1.0" ?>' +
		'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
			'<Default ContentType="application/xml" Extension="xml"/>' +
			'<Default ContentType="application/vnd.openxmlformats-package.relationships+xml" Extension="rels"/>' +
			sheets.map(({ id }) => `<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" PartName="/xl/worksheets/sheet${id}.xml"/>`).join('') +
			sheets.map(({ id, images }) => images ? `<Override ContentType="application/vnd.openxmlformats-officedocument.drawing+xml" PartName="/xl/drawings/drawing${id}.xml"/>` : '').join('') +
			'<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" PartName="/xl/workbook.xml"/>' +
			'<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml" PartName="/xl/sharedStrings.xml"/>' +
			'<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" PartName="/xl/styles.xml"/>' +
			getFileExtensionContentTypes(images).map(({ fileExtension, contentType }) => `<Default Extension="${fileExtension}" ContentType="${contentType}"/>`).join('') +
		'</Types>'
}

function getFileExtensionContentTypes(images) {
	if (!images) {
		return []
	}

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

	if (Array.isArray(images[0])) {
		for (const sheetImages of images) {
			for (const image of sheetImages) {
				addFileExtensionContentType(image)
			}
		}
	} else {
		for (const image of images) {
			addFileExtensionContentType(image)
		}
	}

	return fileExtensionContentTypes
}