// This function doesn't use `async`/`await` in order to avoid adding `@babel/runtime` to `dependencies`.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/105

/**
 * Converts file content to a `Uint8Array`.
 * @param {Blob} fileContent
 * @returns {Promise<Uint8Array>}
 */
export default function convertFileContentToUint8Array(fileContent) {
	if (fileContent instanceof Blob) {
		return blobToUint8Array(fileContent)
	}
	throw new Error('Unsupported file content type. Expected a `Blob`')
}

function blobToUint8Array(blob) {
	return blob.arrayBuffer()
		.then(arrayBuffer => new Uint8Array(arrayBuffer))
}