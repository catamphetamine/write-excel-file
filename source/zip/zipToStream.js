import ZipArchive from 'archiver-node/zip'

// Althernatively, it could use `fflate` if someone writes an example of handling a Node.js stream.
// https://github.com/101arrowz/fflate/issues/251

import { Buffer } from 'buffer'

/**
 * Creates a `*.zip` file from a map of files.
 * @param  {Record<string,Uint8Array>} files
 * @return {object} Returns an object of shape `{ stream, start }` where `stream` is the readable output stream with `.zip` archive data and `start()` is a function that starts writing `.zip` archive data into the `stream`.
 */
export default function zipToStream(files) {
	const archive = new ZipArchive()
	for (const key of Object.keys(files)) {
		archive.add(Buffer.from(files[key]), key)
	}
  return archive.write()
}