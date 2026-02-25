import fs from 'fs'
import Stream from 'stream'
// import { Blob } from 'buffer'

import generateXlsxFileContents from '../xlsx/generateXlsxFileContents.js'
import convertFilesContentToUint8Arrays from './convertFilesContentToUint8Arrays.js'
import convertFileContentToUint8Array from './convertFileContentToUint8ArrayNode.js'

import zipToStream from '../zip/zipToStream.js'

// This function doesn't use `async`/`await` in order to avoid adding `@babel/runtime` to `dependencies`.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/105

/**
 * Creates an `*.xlsx` file.
 * @param {SheetData|object[]} data
 * @param {object} options
 * @returns {Promise<Stream|Buffer|void>} Returns a readable `Stream` or a `Buffer`, or saves the file at given path.
 */
export default function writeXlsxFile(data, {
	filePath,
	buffer,
	// blob,
	...parameters
} = {}) {
	// Generate the sub-files inside the `.xlsx` file.
	const files = generateXlsxFileContents(data, parameters)

	// Convert files' content to `Uint8Array`s.
	return convertFilesContentToUint8Arrays(files, convertFileContentToUint8Array).then((files) => {
		// Create a `.zip` archive from the files.
		// An `.xlsx` file is just a `.zip` archive with an `.xlsx` file extension.
		const zipStream = zipToStream(files)

		// If a `filePath` is specified, write the `.xlsx` file to it.
		if (filePath) {
			return new Promise((resolve, reject) => {
				// Pipe `.zip` archive data to a file.
				zipStream
					.pipe(fs.createWriteStream(filePath))
					// `resolve()` won't return anything.
					.on('finish', resolve)
					.on('error', reject)
			})
		} else if (buffer) {
			// Return a `Promise<Buffer>`.
			return convertStreamToBuffer(zipStream)
		} /* else if (blob) {
			// Return a `Promise<Blob>`.
			return convertStreamToBuffer(zipStream).then((buffer) => {
				return new Blob([buffer], {
					type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
				})
			})
		}*/ else {
			// Return a readable `Stream`.
			return zipStream
		}
	})
}

/**
 * Converts a readable stream to a `Buffer`.
 * https://stackoverflow.com/a/67729663
 * @param {Stream} stream
 * @returns {Promise<Buffer>}
 */
function convertStreamToBuffer(stream) {
	return new Promise((resolve, reject) => {
		const chunks = []
		stream.on('data', (chunk) => {
			chunks.push(chunk)
		})
		stream.on('end', () => {
			resolve(Buffer.concat(chunks))
		})
		stream.on('error', reject)
	})
}