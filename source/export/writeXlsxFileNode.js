import fs, { write } from 'fs'
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
 * @param {SheetData|Sheet[]} arg1
 * @param {object} arg2 — If `arg1` is `SheetData`, `arg2` is `SheetOptions` and `arg3` is `Options`. If `arg1` is `Sheet[]`, `arg2` is `Options`.
 * @param {object} [arg3] — If `arg1` is `SheetData`, `arg2` is `SheetOptions` and `arg3` is `Options`. If `arg1` is `Sheet[]`, `arg2` is `Options`.
 * @returns {object} Returns an object with `async` methods: `toBuffer()`, `toStream(writeStream?)`, `toFile(filePath)`.
 */
export default function writeXlsxFile(arg1, arg2, arg3) {
	// Generate the sub-files inside the `.xlsx` file.
	const files = generateXlsxFileContents(arg1, arg2, arg3)

	const createReadableStream = () => {
		// Convert files' content to `Uint8Array`s.
		return convertFilesContentToUint8Arrays(files, convertFileContentToUint8Array).then((files) => {
			// Create a `.zip` archive from the files.
			// An `.xlsx` file is just a `.zip` archive with an `.xlsx` file extension.
			return zipToStream(files)
		})
	}

	return {
		toBuffer() {
			return createReadableStream().then(convertStreamToBuffer)
		},

		// toBlob() {
		// 	return createReadableStream().then(convertStreamToBuffer).then((buffer) => {
		// 		return new Blob([buffer], {
		// 			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		// 		})
		// 	})
		// },

		toStream(writableStream) {
			if (writableStream) {
				return createReadableStream().then((readableStream) => {
					return pipe(readableStream, writableStream)
				})
			}
			return createReadableStream()
		},

		toFile(filePath) {
			return createReadableStream().then((readableStream) => {
				return pipe(readableStream, fs.createWriteStream(filePath))
			})
		}
	}
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

// Pipes `readableStream` to `writableStream` and returns a `Promise`.
function pipe (readableStream, writableStream) {
	return new Promise((resolve, reject) => {
		// Pipe file data to a writable stream.
		readableStream
			.pipe(writableStream)
			// In Node.js, there're different types of streaming completion events:
			//
			// * "end" —  Is emitted when all data has been read from a readable stream.
			//            Is not emitted on writable streams.
			//
			// * "finish" — Is emitted when all data has been written to a writable stream.
			//              In case of writing to a file, it means that all writes were sent to the Operating System's buffer.
			//
			// * "close" — Is emitted at the end of a readable or writable stream's life.
			//             It indicates that any underlying system resources (like a "file descriptor")
			//             have been closed and destroyed, i.e. "close" fires after "finish"
			//             and ensures that any changes written to the OS buffer have been flushed to disk.
			//             To complicate matters more, "close" event is not mandatory for all types of
			//             writable streams. For example, file output streams do seem to always emit it
			//             while `stdout` (console) streams don't ever emit it.
			//             So at the time of receiving a "finish" event, tehre seems to be no way of knowing
			//             whether a "close" event will follow.
			//
			// There seems to be no need to listen specifically for "close" event.
			// The file is already available for reading from the OS buffer on "finish" event.
			// It's not yet available for "exclusive" writing mode because the "file descriptor" hasn't been "freed" yet,
			// but it seems to be an unlikely scenario that anyone attempts to somehow patch the .xlsx file
			// right after it has been written to the disk.
			//
			// So it listens to "finish" event here rather than "close" event.
			//
			// And `resolve()` won't be called with any argument because "finish" event listener has no arguments.
			//
			.on('finish', resolve)
			.on('error', reject)
	})
}