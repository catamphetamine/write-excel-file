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
 * @param {SheetData|Sheet[]} arg1
 * @param {object} arg2 — If `arg1` is `SheetData`, `arg2` is `SheetOptions` and `arg3` is `Options`. If `arg1` is `Sheet[]`, `arg2` is `Options`.
 * @param {object} [arg3] — If `arg1` is `SheetData`, `arg2` is `SheetOptions` and `arg3` is `Options`. If `arg1` is `Sheet[]`, `arg2` is `Options`.
 * @returns {object} Returns an object with `async` methods: `toBlob()`, `toFile(fileName)`.
 */
export default function writeXlsxFile(arg1, arg2, arg3) {
  const createBlob = () => {
    return generateXlsxFileAsync(arg1, arg2, arg3, convertFileContentToUint8Array)
  }

  return {
    toBlob() {
      return createBlob()
    },

    toFile(fileName) {
      return createBlob().then((blob) => {
        downloadBlob(blob, fileName)
      })
    }
  }


}