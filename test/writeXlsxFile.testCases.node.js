import path from 'path'
import fs from 'fs'

import TEST_CASES, { data, columns } from './writeXlsxFile.testCases.js'

const IMAGES_DIRECTORY = path.resolve('./test/images')

export default {
	...TEST_CASES,

  'node-images-on-multiple-sheets': {
    args: () => [
      [
        {
          data,
          sheet: 'Sheet One',
          columns,
          images: [
            {
              // // File path (deprecated).
              // content: path.join(IMAGES_DIRECTORY, '1.png'),
              // Buffer.
              content: fs.readFileSync(path.join(IMAGES_DIRECTORY, '1.png')),
              contentType: 'image/png',
              width: 48,
              height: 48,
              dpi: 72,
              anchor: {
                row: 1,
                column: 1
              }
            },
            {
              // Buffer.
              content: fs.readFileSync(path.join(IMAGES_DIRECTORY, '2.jpg')),
              contentType: 'image/jpeg',
              width: 48,
              height: 48,
              // Incorrect `dpi`. The image has a DPI of `72`.
              dpi: 96,
              anchor: {
                row: 2,
                column: 5
              }
            }
          ]
        },
        {
          data,
          sheet: 'Sheet Two',
          columns,
          images: [
            {
              // Readable stream.
              content: fs.createReadStream(path.join(IMAGES_DIRECTORY, '3.jpg')),
              contentType: 'image/jpeg',
              width: 48,
              height: 48,
              // The image has a DPI of `72`.
              dpi: 72,
              anchor: {
                row: 1,
                column: 1
              },
              // Has non-zero offset.
              offsetX: 20,
              offsetY: 20
            }
          ]
        }
      ]
    ]
  },

  'node-return-stream': {
    run: async ({ filePath, writeXlsxFile }) => {
      const outputStream = fs.createWriteStream(filePath)

      await new Promise(async (resolve, reject) => {
        const stream = await writeXlsxFile(data, { columns }).toStream()

        stream.pipe(outputStream)
        stream.on('end', function () {
          console.log('Readalbe stream ended')
        })
        stream.on('error', function (error) {
          reject(error)
        })

        outputStream.on('close', function() {
          console.log('Output stream closed')
          resolve()
        })
      })
    }
  },

  'node-write-to-output-stream': {
    run: async ({ filePath, writeXlsxFile }) => {
      const outputStream = fs.createWriteStream(filePath)
      await writeXlsxFile(data, { columns }).toStream(outputStream)
    }
  },

  'node-return-buffer': {
    run: async ({ writeXlsxFile }) => {
      // function writeBufferToFile(buffer, path) {
      //   // open the file in writing mode, adding a callback function where we do the actual writing
      //   const fd = fs.openSync(path, 'w')
      //   // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
      //   fs.writeSync(fd, buffer, 0, buffer.length, null)
      //   fs.closeSync(fd)
      // }

      const buffer = await writeXlsxFile(data, { columns }).toBuffer()
      // writeBufferToFile(buffer, filePath)
    }
  }

  // 'node-return-blob': {
  //   run: async ({ filePath, writeXlsxFile }) => {
  //     function writeBufferToFile(buffer, path) {
  //       // open the file in writing mode, adding a callback function where we do the actual writing
  //       const fd = fs.openSync(path, 'w')
  //       // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
  //       fs.writeSync(fd, buffer, 0, buffer.length, null)
  //       fs.closeSync(fd)
  //     }
  //
	// 		async function blobToBuffer(blob) {
	// 			return Buffer.from(await blob.arrayBuffer())
	// 		}
  //
  //     // import { Readable } from 'stream'
	// 		// function createReadableStreamFromBlob(blob) {
	// 		// 	return Readable.fromWeb(blob.stream())
	// 		// }
  //
  //     const blob = await writeXlsxFile(data, { columns }).toBlob()
  //     writeBufferToFile(await blobToBuffer(blob), filePath)
  //   }
  // }
}