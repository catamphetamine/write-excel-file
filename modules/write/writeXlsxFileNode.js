import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import fs from 'fs';
import path from 'path';
import os from 'os';
import Stream, { Readable } from 'stream';
import Archive from './archive.js';
import getImageFileName from './getImageFileName.js';
import generateWorkbookXml from './files/workbook.xml.js';
import generateWorkbookXmlRels from './files/workbook.xml.rels.js';
import rels from './files/rels.js';
import generateContentTypesXml from './files/[Content_Types].xml.js';
import generateDrawingXml from './files/drawing.xml.js';
import generateDrawingXmlRels from './files/drawing.xml.rels.js';
import generateSheetXmlRels from './files/sheet.xml.rels.js';
import generateSharedStringsXml from './files/sharedStrings.xml.js';
import generateStylesXml from './files/styles.xml.js';
import { generateSheets } from './writeXlsxFile.common.js';
export default function writeXlsxFile(_x) {
  return _writeXlsxFile.apply(this, arguments);
}

// According to Node.js docs:
// https://nodejs.org/api/fs.html#fswritefilefile-data-options-callback
// `contents` argument could be of type:
// * string — File path
// * Buffer
// * TypedArray
// * DataView
function _writeXlsxFile() {
  _writeXlsxFile = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(data) {
    var _ref,
      filePath,
      buffer,
      sheetName,
      sheetNames,
      schema,
      columns,
      images,
      headerStyle,
      getHeaderStyle,
      fontFamily,
      fontSize,
      orientation,
      stickyRowsCount,
      stickyColumnsCount,
      showGridLines,
      rightToLeft,
      dateFormat,
      archive,
      _generateSheets,
      sheets,
      getSharedStrings,
      getStyles,
      root,
      xl,
      mediaPath,
      drawingsPath,
      drawingsRelsPath,
      _rels,
      worksheetsPath,
      worksheetsRelsPath,
      promises,
      _iterator2,
      _step2,
      _step2$value,
      id,
      _data,
      _images,
      _iterator3,
      _step3,
      image,
      imageContentReadableStream,
      imageFilePath,
      _args = arguments;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _ref = _args.length > 1 && _args[1] !== undefined ? _args[1] : {}, filePath = _ref.filePath, buffer = _ref.buffer, sheetName = _ref.sheet, sheetNames = _ref.sheets, schema = _ref.schema, columns = _ref.columns, images = _ref.images, headerStyle = _ref.headerStyle, getHeaderStyle = _ref.getHeaderStyle, fontFamily = _ref.fontFamily, fontSize = _ref.fontSize, orientation = _ref.orientation, stickyRowsCount = _ref.stickyRowsCount, stickyColumnsCount = _ref.stickyColumnsCount, showGridLines = _ref.showGridLines, rightToLeft = _ref.rightToLeft, dateFormat = _ref.dateFormat;
          // I dunno why it uses `Archive` here instead of something like `JSZip`
          // that is used in `writeXlsxFileBrowser.js`.
          archive = new Archive(filePath);
          _generateSheets = generateSheets({
            data: data,
            sheetName: sheetName,
            sheetNames: sheetNames,
            schema: schema,
            columns: columns,
            images: images,
            headerStyle: headerStyle,
            getHeaderStyle: getHeaderStyle,
            fontFamily: fontFamily,
            fontSize: fontSize,
            orientation: orientation,
            stickyRowsCount: stickyRowsCount,
            stickyColumnsCount: stickyColumnsCount,
            showGridLines: showGridLines,
            rightToLeft: rightToLeft,
            dateFormat: dateFormat
          }), sheets = _generateSheets.sheets, getSharedStrings = _generateSheets.getSharedStrings, getStyles = _generateSheets.getStyles; // There doesn't seem to be a way to just append a file into a subdirectory
          // in `archiver` library, hence using a hacky temporary directory workaround.
          // https://www.npmjs.com/package/archiver
          _context.next = 5;
          return createTempDirectory();
        case 5:
          root = _context.sent;
          _context.next = 8;
          return createDirectory(path.join(root, 'xl'));
        case 8:
          xl = _context.sent;
          _context.next = 11;
          return createDirectory(path.join(xl, 'media'));
        case 11:
          mediaPath = _context.sent;
          _context.next = 14;
          return createDirectory(path.join(xl, 'drawings'));
        case 14:
          drawingsPath = _context.sent;
          _context.next = 17;
          return createDirectory(path.join(drawingsPath, '_rels'));
        case 17:
          drawingsRelsPath = _context.sent;
          _context.next = 20;
          return createDirectory(path.join(xl, '_rels'));
        case 20:
          _rels = _context.sent;
          _context.next = 23;
          return createDirectory(path.join(xl, 'worksheets'));
        case 23:
          worksheetsPath = _context.sent;
          _context.next = 26;
          return createDirectory(path.join(worksheetsPath, '_rels'));
        case 26:
          worksheetsRelsPath = _context.sent;
          promises = [writeFile(path.join(_rels, 'workbook.xml.rels'), generateWorkbookXmlRels({
            sheets: sheets
          })), writeFile(path.join(xl, 'workbook.xml'), generateWorkbookXml({
            sheets: sheets,
            stickyRowsCount: stickyRowsCount,
            stickyColumnsCount: stickyColumnsCount
          })), writeFile(path.join(xl, 'styles.xml'), generateStylesXml(getStyles())), writeFile(path.join(xl, 'sharedStrings.xml'), generateSharedStringsXml(getSharedStrings()))];
          for (_iterator2 = _createForOfIteratorHelperLoose(sheets); !(_step2 = _iterator2()).done;) {
            _step2$value = _step2.value, id = _step2$value.id, _data = _step2$value.data, _images = _step2$value.images;
            promises.push(writeFile(path.join(worksheetsPath, "sheet".concat(id, ".xml")), _data));
            promises.push(writeFile(path.join(worksheetsRelsPath, "sheet".concat(id, ".xml.rels")), generateSheetXmlRels({
              id: id,
              images: _images
            })));
            if (_images) {
              promises.push(writeFile(path.join(drawingsPath, "drawing".concat(id, ".xml")), generateDrawingXml({
                images: _images
              })));
              promises.push(writeFile(path.join(drawingsRelsPath, "drawing".concat(id, ".xml.rels")), generateDrawingXmlRels({
                images: _images,
                sheetId: id
              })));
              // Copy images to `xl/media` folder.
              for (_iterator3 = _createForOfIteratorHelperLoose(_images); !(_step3 = _iterator3()).done;) {
                image = _step3.value;
                imageContentReadableStream = getReadableStream(image.content);
                imageFilePath = path.join(mediaPath, getImageFileName(image, {
                  sheetId: id,
                  sheetImages: _images
                }));
                promises.push(writeFileFromStream(imageFilePath, imageContentReadableStream));
              }
            }
          }
          _context.next = 31;
          return Promise.all(promises);
        case 31:
          archive.directory(xl, 'xl');
          archive.append(rels, '_rels/.rels');
          archive.append(generateContentTypesXml({
            images: images,
            sheets: sheets
          }), '[Content_Types].xml');
          if (!filePath) {
            _context.next = 41;
            break;
          }
          _context.next = 37;
          return archive.write();
        case 37:
          _context.next = 39;
          return removeDirectoryWithLegacyNodeVersionsSupport(root);
        case 39:
          _context.next = 46;
          break;
        case 41:
          if (!buffer) {
            _context.next = 45;
            break;
          }
          return _context.abrupt("return", streamToBuffer(archive.write()));
        case 45:
          return _context.abrupt("return", archive.write());
        case 46:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _writeXlsxFile.apply(this, arguments);
}
function writeFile(path, contents) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(path, contents, 'utf-8', function (error) {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}
function createDirectory(path) {
  return new Promise(function (resolve, reject) {
    fs.mkdir(path, function (error) {
      if (error) {
        return reject(error);
      }
      resolve(path);
    });
  });
}
function createTempDirectory() {
  return new Promise(function (resolve, reject) {
    fs.mkdtemp(path.join(os.tmpdir(), 'write-excel-file-'), function (error, directoryPath) {
      if (error) {
        return reject(error);
      }
      resolve(directoryPath);
    });
  });
}
function removeDirectoryWithLegacyNodeVersionsSupport(path) {
  if (fs.rm) {
    return removeDirectory(path);
  } else {
    removeDirectoryLegacySync(path);
    return Promise.resolve();
  }
}

// `fs.rm()` is available in Node.js since `14.14.0`.
function removeDirectory(path) {
  return new Promise(function (resolve, reject) {
    fs.rm(path, {
      recursive: true,
      force: true
    }, function (error) {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

// For Node.js versions below `14.14.0`.
function removeDirectoryLegacySync(directoryPath) {
  var childNames = fs.readdirSync(directoryPath);
  for (var _iterator = _createForOfIteratorHelperLoose(childNames), _step; !(_step = _iterator()).done;) {
    var childName = _step.value;
    var childPath = path.join(directoryPath, childName);
    var stats = fs.statSync(childPath);
    if (childPath === '.' || childPath === '..') {
      // Skip.
    } else if (stats.isDirectory()) {
      // Remove subdirectory recursively.
      removeDirectoryLegacySync(childPath);
    } else {
      // Remove file.
      fs.unlinkSync(childPath);
    }
  }
  fs.rmdirSync(directoryPath);
}

// https://stackoverflow.com/a/67729663
function streamToBuffer(stream) {
  return new Promise(function (resolve, reject) {
    var chunks = [];
    stream.on('data', function (chunk) {
      return chunks.push(chunk);
    });
    stream.on('end', function () {
      return resolve(Buffer.concat(chunks));
    });
    stream.on('error', reject);
  });
}
function copyFile(fromPath, toPath) {
  return new Promise(function (resolve, reject) {
    fs.copyFile(fromPath, toPath, function (error) {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}
function getReadableStream(source) {
  if (source instanceof Stream) {
    return source;
  }
  if (source instanceof Buffer) {
    return Readable.from(source);
  }
  if (typeof source === 'string') {
    return fs.createReadStream(source);
  }
  throw new Error('Unsupported content source: couldn\'t convert it to a readable stream');
}
function writeFileFromStream(filePath, readableStream) {
  var writableStream = fs.createWriteStream(filePath);
  readableStream.pipe(writableStream);
  return new Promise(function (resolve) {
    return writableStream.on('finish', resolve);
  });
}
//# sourceMappingURL=writeXlsxFileNode.js.map