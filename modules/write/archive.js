function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// Copy-pasted from:
// https://github.com/catamphetamine/serverless-functions/blob/master/source/deploy/archive.js

// Uses `archiver` library.
// https://www.npmjs.com/package/archiver

import archiver from 'archiver';
// import { WritableStream } from 'memory-streams'
import fs from 'fs';

/**
 * A server-side *.zip archive creator.
 */
var Archive = /*#__PURE__*/function () {
  function Archive(outputPath) {
    _classCallCheck(this, Archive);
    var output;
    if (outputPath) {
      output = fs.createWriteStream(outputPath);
    } else {
      // // Won't work for memory streams.
      // // https://github.com/archiverjs/node-archiver/issues/336
      // output = new WritableStream()
    }
    var archive = archiver('zip', {
      // // Sets the compression level.
      // zlib: { level: 9 }
    });
    this.archive = archive;
    if (output) {
      this.promise = new Promise(function (resolve, reject) {
        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', function () {
          return resolve({
            size: archive.pointer()
          });
        });

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
        archive.on('warning', function (error) {
          if (error.code === 'ENOENT') {
            // log warning
            console.warn(error);
          } else {
            reject(error);
          }
        });

        // good practice to catch this error explicitly
        archive.on('error', reject);

        // pipe archive data to the file
        archive.pipe(output);
      });
    }
  }
  return _createClass(Archive, [{
    key: "file",
    value: function file(filePath, internalPath) {
      this.archive.file(filePath, {
        name: internalPath
      });
    }
  }, {
    key: "directory",
    value: function directory(directoryPath, internalPath) {
      this.archive.directory(directoryPath, internalPath);
    }
  }, {
    key: "append",
    value: function append(content, internalPath) {
      this.archive.append(content, {
        name: internalPath
      });
    }
  }, {
    key: "write",
    value: function write() {
      // Maybe `.finalize()` itself returns some `Promise`.
      this.archive.finalize();
      return this.promise || this.archive;
    }
  }]);
}();
export { Archive as default };
//# sourceMappingURL=archive.js.map