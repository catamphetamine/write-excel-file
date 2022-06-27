// Copy-pasted from:
// https://github.com/catamphetamine/serverless-functions/blob/master/source/deploy/archive.js

// Uses `archiver` library.
// https://www.npmjs.com/package/archiver

import archiver from 'archiver'
// import { WritableStream } from 'memory-streams'
import fs from 'fs'

/**
 * A server-side *.zip archive creator.
 */
export default class Archive {
  constructor(outputPath) {
    let output
    if (outputPath) {
      output = fs.createWriteStream(outputPath)
    } else {
      // // Won't work for memory streams.
      // // https://github.com/archiverjs/node-archiver/issues/336
      // output = new WritableStream()
    }

    const archive = archiver('zip', {
      // // Sets the compression level.
      // zlib: { level: 9 }
    })

    this.archive = archive

    if (output) {
      this.promise = new Promise((resolve, reject) => {
        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', () => resolve({ size: archive.pointer() }))

        // // This event is fired when the data source is drained no matter what was the data source.
        // // It is not part of this library but rather from the NodeJS Stream API.
        // // @see: https://nodejs.org/api/stream.html#stream_event_end
        // archive.on('end', function() {
        //   console.log('Data has been drained')
        //   resolve({
        //     // output: outputPath ? undefined : output.toBuffer(),
        //     size: archive.pointer()
        //   })
        // })

        // good practice to catch warnings (ie stat failures and other non-blocking errors)
        archive.on('warning', function(error) {
          if (error.code === 'ENOENT') {
            // log warning
            console.warn(error)
          } else {
            reject(error)
          }
        })

        // good practice to catch this error explicitly
        archive.on('error', reject)

        // pipe archive data to the file
        archive.pipe(output)
      })
    }
  }

  file(filePath, internalPath) {
    this.archive.file(filePath, { name: internalPath })
  }

  directory(directoryPath, internalPath) {
    this.archive.directory(directoryPath, internalPath);
  }

  append(content, internalPath) {
    this.archive.append(content, { name: internalPath })
  }

  write() {
    // Maybe `.finalize()` itself returns some `Promise`.
    this.archive.finalize()
    return this.promise || this.archive
  }
}
