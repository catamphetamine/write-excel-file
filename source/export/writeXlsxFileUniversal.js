import convertFileContentToUint8Array from './convertFileContentToUint8ArrayUniversal.js'

import zipToArrayBuffer from '../zip/zipToArrayBuffer.js'
import zipToArrayBufferSync from '../zip/zipToArrayBufferSync.js'

import convertFilesContentToUint8Arrays from './convertFilesContentToUint8Arrays.js'
import generateXlsxFileContents from '../xlsx/generateXlsxFileContents.js'

// This function doesn't use `async`/`await` in order to avoid adding `@babel/runtime` to `dependencies`.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/105

/**
 * Creates an `*.xlsx` file.
 * @param {SheetData|Sheet[]} arg1
 * @param {object} arg2 — If `arg1` is `SheetData`, `arg2` is `SheetOptions` and `arg3` is `Options`. If `arg1` is `Sheet[]`, `arg2` is `Options`.
 * @param {object} [arg3] — If `arg1` is `SheetData`, `arg2` is `SheetOptions` and `arg3` is `Options`. If `arg1` is `Sheet[]`, `arg2` is `Options`.
 * @returns {object} Returns an object with `async` methods: `toBlob()`.
 */
export default function writeXlsxFile(arg1, arg2, arg3) {
	return {
		toBlob() {
			return generateXlsxFileAsync(arg1, arg2, arg3, convertFileContentToUint8Array)
		}
	}
}

/**
 * @return {Promise<Blob>}
 */
function generateXlsxFile(
	arg1,
	arg2,
	arg3,
	convertFileContentToUint8Array,
	createZipArchiveAsArrayBuffer,
	isAsyncZip
) {
	// Generate the sub-files inside the `.xlsx` file.
	const files = generateXlsxFileContents(arg1, arg2, arg3)

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
export function generateXlsxFileSync(arg1, arg2, arg3, convertFileContentToUint8Array) {
	return generateXlsxFile(arg1, arg2, arg3, convertFileContentToUint8Array, zipToArrayBufferSync, false)
}

/**
 * Generates an *.xlsx file "asynchronously".
 * @return {Promise<Blob>}
 */
export function generateXlsxFileAsync(arg1, arg2, arg3, convertFileContentToUint8Array) {
	return generateXlsxFile(arg1, arg2, arg3, convertFileContentToUint8Array, zipToArrayBuffer, true)
}