import fs from 'fs'
import path from 'path'
import os from 'os'

import Archive from './archive'

import workbookXML from './statics/workbook.xml'
import workbookXMLRels from './statics/workbook.xml.rels'
import rels from './statics/rels'
import contentTypes from './statics/[Content_Types].xml'

import generateWorksheet from './worksheet'
import initStyles from './styles'
import initSharedStrings from './sharedStrings'

export default async function writeXlsxFile(data, { filePath, schema, columns } = {}) {
	const archive = new Archive(filePath)

  const { getSharedStringsXml, getSharedString } = initSharedStrings()
  const { getStylesXml, getStyle } = initStyles()
	const worksheet = generateWorksheet(data, { schema, columns, getStyle, getSharedString })

	// There doesn't seem to be a way to just append a file into a subdirectory
	// in `archiver` library, hence using a hacky temporary directory workaround.
	// https://www.npmjs.com/package/archiver
	const root = await createTempDirectory()
	const xl = await createDirectory(path.join(root, 'xl'))
	const _rels = await createDirectory(path.join(xl, '_rels'))
	const worksheets = await createDirectory(path.join(xl, 'worksheets'))

	await Promise.all([
		writeFile(path.join(_rels, 'workbook.xml.rels'), workbookXMLRels),
		writeFile(path.join(worksheets, 'sheet1.xml'), worksheet),
		writeFile(path.join(xl, 'workbook.xml'), workbookXML),
		writeFile(path.join(xl, 'styles.xml'), getStylesXml()),
		writeFile(path.join(xl, 'sharedStrings.xml'), getSharedStringsXml())
	])

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