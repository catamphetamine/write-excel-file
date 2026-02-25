// Uses an "async" function of the zipper function
// just because it feels more correct to use it over the "sync" one
// because it isn't supposed to ever freeze the "main thread" (GUI).
//
// import { generateXlsxFileSync } from './writeXlsxFileUniversal.js'
import { generateXlsxFileAsync } from './writeXlsxFileUniversal.js'

import convertFileContentToUint8Array from './convertFileContentToUint8ArrayBrowser.js'
import downloadBlob from './downloadBlob.js'

// This function doesn't use `async`/`await` in order to avoid adding `@babel/runtime` to `dependencies`.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/105

/**
 * Creates an `*.xlsx` file.
 * @param {SheetData|object[]} data
 * @param {object} options
 * @returns {Promise<Blob|void>} Returns a `Blob` or automatically downloads the file.
 */
export default function writeXlsxFile(data, { fileName, ...options } = {}) {
  return generateXlsxFileAsync(data, options, convertFileContentToUint8Array).then((blob) => {
    if (fileName) {
      return downloadBlob(blob, fileName)
    }
    return blob
  })
}