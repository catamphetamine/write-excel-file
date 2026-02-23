import Stream from 'stream'
import { Buffer, Blob } from 'buffer'

// This function doesn't use `async`/`await` in order to avoid adding `@babel/runtime` to `dependencies`.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/105

/**
 * Converts file content to a `Uint8Array`.
 * @param {Stream|Buffer|Blob} fileContent
 * @returns {Promise<Uint8Array>}
 */
export default function convertFileContentToUint8Array(fileContent) {
	if (fileContent instanceof Stream) {
		return streamToUint8Array(fileContent)
	}
	if (fileContent instanceof Blob) {
		return blobToUint8Array(fileContent)
	}
	if (fileContent instanceof Buffer) {
		// `Buffer` is an instance of `Uint8Array`.
		return Promise.resolve(fileContent)
	}
	throw new Error('Unsupported file content type. Expected a `Stream`, a `Blob` or a `Buffer`')
}

function streamToUint8Array(stream) {
	return new Promise((resolve, reject) => {
		const chunks = []
		stream.on('data', (chunk) => {
			chunks.push(chunk)
		})
		stream.on('end', () => {
			// `Buffer` is a subclass of `Uint8Array`
			resolve(Buffer.concat(chunks))
		})
		stream.on('error', reject)
	})
}

function blobToUint8Array(blob) {
	return blob.arrayBuffer()
		.then(arrayBuffer => new Uint8Array(arrayBuffer))
}