import fs from 'fs'
import path from 'path'
import os from 'os'

import Archive from './archive'

import generateWorkbookXml from './statics/workbook.xml'
import generateWorkbookXmlRels from './statics/workbook.xml.rels'
import rels from './statics/rels'
import contentTypes from './statics/[Content_Types].xml'

import { generateSheets } from './writeXlsxFile.common'

export default async function writeXlsxFile(data, {
	filePath,
	sheet: sheetName,
	sheets: sheetNames,
	schema,
	columns,
	headerStyle,
	fontFamily,
	fontSize,
	orientation,
	stickyRowsCount,
	stickyColumnsCount,
	dateFormat
} = {}) {
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
		headerStyle,
		fontFamily,
		fontSize,
		orientation,
		stickyRowsCount,
		stickyColumnsCount,
		dateFormat
	})

	// There doesn't seem to be a way to just append a file into a subdirectory
	// in `archiver` library, hence using a hacky temporary directory workaround.
	// https://www.npmjs.com/package/archiver
	const root = await createTempDirectory()
	const xl = await createDirectory(path.join(root, 'xl'))
	const _rels = await createDirectory(path.join(xl, '_rels'))
	const worksheetsPath = await createDirectory(path.join(xl, 'worksheets'))

	const promises = [
		writeFile(path.join(_rels, 'workbook.xml.rels'), generateWorkbookXmlRels({ sheets })),
		writeFile(path.join(xl, 'workbook.xml'), generateWorkbookXml({ sheets })),
		writeFile(path.join(xl, 'styles.xml'), getStylesXml()),
		writeFile(path.join(xl, 'sharedStrings.xml'), getSharedStringsXml())
	]

	for (const { id, data } of sheets) {
		promises.push(writeFile(path.join(worksheetsPath, `sheet${id}.xml`), data))
	}

	await Promise.all(promises)

	archive.directory(xl, 'xl')
	archive.append(rels, '_rels/.rels')
	archive.append(contentTypes, '[Content_Types].xml')

	if (filePath) {
		await archive.write()
		await removeDirectory(root)
	} else {
		return archive.write()
	}
}

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

function removeDirectory(path) {
	return new Promise((resolve, reject) => {
		fs.rmdir(path, { recursive: true }, (error) => {
			if (error) {
				return reject(error)
			}
			resolve(path)
		})
	})
}