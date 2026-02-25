import convertFileContentToUint8Array from './convertFileContentToUint8ArrayUniversal.js'

import zipToArrayBuffer from '../zip/zipToArrayBuffer.js'
import zipToArrayBufferSync from '../zip/zipToArrayBufferSync.js'

import convertFilesContentToUint8Arrays from './convertFilesContentToUint8Arrays.js'
import generateXlsxFileContents from '../xlsx/generateXlsxFileContents.js'

// This function doesn't use `async`/`await` in order to avoid adding `@babel/runtime` to `dependencies`.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/105

/**
 * Creates an `*.xlsx` file.
 * @param {SheetData|object[]} data
 * @param {object} options
 * @returns {Promise<Blob|void>} Returns a `Blob` or automatically downloads the file.
 */
export default function writeXlsxFile(data, parameters) {
	return generateXlsxFileAsync(data, parameters, convertFileContentToUint8Array)
}

/**
 * @return {Promise<Blob>}
 */
function generateXlsxFile(
	data,
	parameters,
	convertFileContentToUint8Array,
	createZipArchiveAsArrayBuffer,
	isAsyncZip
) {
	// Generate the sub-files inside the `.xlsx` file.
	const files = generateXlsxFileContents(data, parameters)

	// Convert files' content to `Uint8Array`s.
	return convertFilesContentToUint8Arrays(files, convertFileContentToUint8Array).then((files) => {
		// Create a `.zip` archive from the files.
		// An `.xlsx` file is just a `.zip` archive with an `.xlsx` file extension.
		// `result` is either `Uint8Array` or `Promise<Uint8Array>`
		const result = createZipArchiveAsArrayBuffer(files)
		// Return a `Blob` with the `.zip` archive data.
		if (isAsyncZip) {
			return result.then(result => convertArrayBufferToBlob(result))
		} else {
			return convertArrayBufferToBlob(result)
		}
	})
}

// Converts `ArrayBuffer` to `Blob`.
function convertArrayBufferToBlob(arrayBuffer) {
	return new Blob([arrayBuffer], {
		type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	})
}

/**
 * Generates an *.xlsx file "synchronously".
 * @return {Promise<Blob>}
 */
export function generateXlsxFileSync(data, parameters, convertFileContentToUint8Array) {
	return generateXlsxFile(data, parameters, convertFileContentToUint8Array, zipToArrayBufferSync, false)
}

/**
 * Generates an *.xlsx file "asynchronously".
 * @return {Promise<Blob>}
 */
export function generateXlsxFileAsync(data, parameters, convertFileContentToUint8Array) {
	return generateXlsxFile(data, parameters, convertFileContentToUint8Array, zipToArrayBuffer, true)
}