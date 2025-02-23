import fs from 'fs'
import path from 'path'
import os from 'os'
import Stream, { Readable } from 'stream'

import Archive from './archive.js'
import getImageFileName from './getImageFileName.js'

import generateWorkbookXml from './statics/workbook.xml.js'
import generateWorkbookXmlRels from './statics/workbook.xml.rels.js'
import rels from './statics/rels.js'
import generateContentTypesXml from './statics/[Content_Types].xml.js'
import generateDrawingXml from './statics/drawing.xml.js'
import generateDrawingXmlRels from './statics/drawing.xml.rels.js'
import generateSheetXmlRels from './statics/sheet.xml.rels.js'

import { generateSheets } from './writeXlsxFile.common.js'

export default async function writeXlsxFile(data, {
	filePath,
	buffer,
	sheet: sheetName,
	sheets: sheetNames,
	schema,
	columns,
	images,
	headerStyle,
	getHeaderStyle,
	fontFamily,
	fontSize,
	orientation,
	stickyRowsCount,
	stickyColumnsCount,
	showGridLines,
	rightToLeft,
	dateFormat
} = {}) {
	// I dunno why it uses `Archive` here instead of something like `JSZip`
	// that is used in `writeXlsxFileBrowser.js`.
	const archive = new Archive(filePath)

	const {
		sheets,
		getSharedStringsXml,
		getStylesXml
	} = generateSheets({
		data,
		sheetName,
		sheetNames,
		schema,
		columns,
		images,
		headerStyle,
		getHeaderStyle,
		fontFamily,
		fontSize,
		orientation,
		stickyRowsCount,
		stickyColumnsCount,
		showGridLines,
		rightToLeft,
		dateFormat
	})

	// There doesn't seem to be a way to just append a file into a subdirectory
	// in `archiver` library, hence using a hacky temporary directory workaround.
	// https://www.npmjs.com/package/archiver
	const root = await createTempDirectory()
	const xl = await createDirectory(path.join(root, 'xl'))
	const mediaPath = await createDirectory(path.join(xl, 'media'))
	const drawingsPath = await createDirectory(path.join(xl, 'drawings'))
	const drawingsRelsPath = await createDirectory(path.join(drawingsPath, '_rels'))
	const _rels = await createDirectory(path.join(xl, '_rels'))
	const worksheetsPath = await createDirectory(path.join(xl, 'worksheets'))
	const worksheetsRelsPath = await createDirectory(path.join(worksheetsPath, '_rels'))

	const promises = [
		writeFile(path.join(_rels, 'workbook.xml.rels'), generateWorkbookXmlRels({ sheets })),
		writeFile(path.join(xl, 'workbook.xml'), generateWorkbookXml({ sheets, stickyRowsCount, stickyColumnsCount })),
		writeFile(path.join(xl, 'styles.xml'), getStylesXml()),
		writeFile(path.join(xl, 'sharedStrings.xml'), getSharedStringsXml())
	]

	for (const { id, data, images } of sheets) {
		promises.push(writeFile(path.join(worksheetsPath, `sheet${id}.xml`), data))
		promises.push(writeFile(path.join(worksheetsRelsPath, `sheet${id}.xml.rels`), generateSheetXmlRels({ id, images })))
		if (images) {
			promises.push(writeFile(path.join(drawingsPath, `drawing${id}.xml`), generateDrawingXml({ images })))
			promises.push(writeFile(path.join(drawingsRelsPath, `drawing${id}.xml.rels`), generateDrawingXmlRels({ images, sheetId: id })))
			// Copy images to `xl/media` folder.
			for (const image of images) {
				const imageContentReadableStream = getReadableStream(image.content)
				const imageFilePath = path.join(mediaPath, getImageFileName(image, { sheetId: id, sheetImages: images }))
				promises.push(writeFileFromStream(imageFilePath, imageContentReadableStream))
			}
		}
	}

	await Promise.all(promises)

	archive.directory(xl, 'xl')

	archive.append(rels, '_rels/.rels')

  archive.append(generateContentTypesXml({ images, sheets }), '[Content_Types].xml')

	if (filePath) {
		await archive.write()
		await removeDirectoryWithLegacyNodeVersionsSupport(root)
	} else if (buffer) {
		return streamToBuffer(archive.write())
	} else {
		return archive.write()
	}
}

// According to Node.js docs:
// https://nodejs.org/api/fs.html#fswritefilefile-data-options-callback
// `contents` argument could be of type:
// * string — File path
// * Buffer
// * TypedArray
// * DataView
function writeFile(path, contents) {
	return new Promise((resolve, reject) => {
		fs.writeFile(path, contents, 'utf-8', (error) => {
			if (error) {
				return reject(error)
			}
			resolve()
		})
	})
}

function createDirectory(path) {
	return new Promise((resolve, reject) => {
		fs.mkdir(path, (error) => {
			if (error) {
				return reject(error)
			}
			resolve(path)
		})
	})
}

function createTempDirectory() {
	return new Promise((resolve, reject) => {
		fs.mkdtemp(path.join(os.tmpdir(), 'write-excel-file-'), (error, directoryPath) => {
			if (error) {
				return reject(error)
			}
			resolve(directoryPath)
		})
	})
}

function removeDirectoryWithLegacyNodeVersionsSupport(path) {
	if (fs.rm) {
		return removeDirectory(path)
	} else {
		removeDirectoryLegacySync(path)
  	return Promise.resolve()
	}
}

// `fs.rm()` is available in Node.js since `14.14.0`.
function removeDirectory(path) {
	return new Promise((resolve, reject) => {
		fs.rm(path, { recursive: true, force: true }, (error) => {
			if (error) {
				return reject(error)
			}
			resolve()
		})
	})
}

// For Node.js versions below `14.14.0`.
function removeDirectoryLegacySync(directoryPath) {
  const childNames = fs.readdirSync(directoryPath)
  for (const childName of childNames) {
    const childPath = path.join(directoryPath, childName)
    const stats = fs.statSync(childPath)
    if (childPath === '.' || childPath === '..') {
      // Skip.
    } else if (stats.isDirectory()) {
      // Remove subdirectory recursively.
      removeDirectoryLegacySync(childPath)
    } else {
      // Remove file.
      fs.unlinkSync(childPath)
    }
  }
  fs.rmdirSync(directoryPath)
}

// https://stackoverflow.com/a/67729663
function streamToBuffer(stream) {
	return new Promise((resolve, reject) => {
		const chunks = []
		stream.on('data', (chunk) => chunks.push(chunk))
		stream.on('end', () => resolve(Buffer.concat(chunks)))
		stream.on('error', reject)
	})
}

function copyFile(fromPath, toPath) {
	return new Promise((resolve, reject) => {
		fs.copyFile(fromPath, toPath, (error) => {
			if (error) {
				return reject(error)
			}
			resolve()
		})
	})
}

function getReadableStream(source) {
	if (source instanceof Stream) {
		return source
	}
	if (source instanceof Buffer) {
		return Readable.from(source)
	}
	if (typeof source === 'string') {
		return fs.createReadStream(source)
	}
	throw new Error('Unsupported content source: couldn\'t convert it to a readable stream')
}

function writeFileFromStream(filePath, readableStream) {
	const writableStream = fs.createWriteStream(filePath)
	readableStream.pipe(writableStream)
	return new Promise(resolve => writableStream.on('finish', resolve))
}