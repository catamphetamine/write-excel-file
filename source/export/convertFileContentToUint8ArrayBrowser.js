// This function doesn't use `async`/`await` in order to avoid adding `@babel/runtime` to `dependencies`.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/105

/**
 * Converts file content to a `Uint8Array`.
 * @param {File|Blob|ArrayBuffer} fileContent
 * @returns {Promise<Uint8Array>}
 */
export default function convertFileContentToUint8Array(fileContent) {
	if (fileContent instanceof File) {
		return fileContent.arrayBuffer().then(arrayBufferToUint8Array)
	}
	if (fileContent instanceof Blob) {
		return fileContent.arrayBuffer().then(arrayBufferToUint8Array)
	}
	if (fileContent instanceof ArrayBuffer) {
		return Promise.resolve(arrayBufferToUint8Array(fileContent))
	}
	throw new Error('Unsupported file content type. Expected a `File`, a `Blob` or an `ArrayBuffer`')
}

function arrayBufferToUint8Array(arrayBuffer) {
	return new Uint8Array(arrayBuffer)
}