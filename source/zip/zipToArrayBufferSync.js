// `fflate` readme is too complicated:
// https://github.com/101arrowz/fflate/issues/251
// I just used whatever approach seemed to work.
//
// It was a choice between "syncrhonous" (blocking) unzip via `zipSync()`
// and "asynchronous" (non-blocking) unzip via `zip()`.
//
// In the readme they say that using "asynchronous" API  will cause the compression or decompression
// run in a separate thread by using Web (or Node) Workers, so it won't block the main thread.
// Yet, they also say that there is an initial overhead to using workers of about 50ms for each
// asynchronous function. For small (under about 50kB) payloads, they say that the "asynchronous" API
// will be much slower compared to the "synchronous" one. However, when compressing larger files
// or multiple files at once, the "synchronous" API causes the main thread to hang for too long,
// and the "asynchronous" API is an order of magnitude better.
//
import { zipSync } from 'fflate'

/**
 * Creates a `*.zip` file from a map of files.
 * @param  {Record<string,Uint8Array>} files
 * @return {ArrayBuffer} `*.zip` file data.
 */
export default function zipToArrayBufferSync(files) {
	const uint8Array = zipSync(files)
	return uint8Array.buffer
}