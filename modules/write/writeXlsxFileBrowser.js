var _excluded = ["fileName"];
function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/zipcelx.js

import JSZip from 'jszip';
import FileSaver from 'file-saver';
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
export default function writeXlsxFile(data) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    fileName = _ref.fileName,
    rest = _objectWithoutProperties(_ref, _excluded);
  return generateXlsxFile(data, rest).then(function (blob) {
    if (fileName) {
      return FileSaver.saveAs(blob, fileName);
    }
    return blob;
  });
}

/**
 * Writes an *.xlsx file into a "blob".
 * https://github.com/egeriis/zipcelx/issues/68
 * "The reason if you want to send the excel file or store it natively on Cordova/capacitor app".
 * @return {Blob}
 */
function generateXlsxFile(data, _ref2) {
  var sheetName = _ref2.sheet,
    sheetNames = _ref2.sheets,
    schema = _ref2.schema,
    columns = _ref2.columns,
    images = _ref2.images,
    headerStyle = _ref2.headerStyle,
    getHeaderStyle = _ref2.getHeaderStyle,
    fontFamily = _ref2.fontFamily,
    fontSize = _ref2.fontSize,
    orientation = _ref2.orientation,
    stickyRowsCount = _ref2.stickyRowsCount,
    stickyColumnsCount = _ref2.stickyColumnsCount,
    showGridLines = _ref2.showGridLines,
    rightToLeft = _ref2.rightToLeft,
    dateFormat = _ref2.dateFormat;
  var zip = new JSZip();
  var _generateSheets = generateSheets({
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
    }),
    sheets = _generateSheets.sheets,
    getSharedStrings = _generateSheets.getSharedStrings,
    getStyles = _generateSheets.getStyles;
  zip.file('_rels/.rels', rels);
  zip.file('[Content_Types].xml', generateContentTypesXml({
    images: images,
    sheets: sheets
  }));
  var xl = zip.folder('xl');
  xl.file('_rels/workbook.xml.rels', generateWorkbookXmlRels({
    sheets: sheets
  }));
  xl.file('workbook.xml', generateWorkbookXml({
    sheets: sheets,
    stickyRowsCount: stickyRowsCount,
    stickyColumnsCount: stickyColumnsCount
  }));
  xl.file('styles.xml', generateStylesXml(getStyles()));
  xl.file('sharedStrings.xml', generateSharedStringsXml(getSharedStrings()));
  for (var _iterator = _createForOfIteratorHelperLoose(sheets), _step; !(_step = _iterator()).done;) {
    var _step$value = _step.value,
      id = _step$value.id,
      _data = _step$value.data,
      _images = _step$value.images;
    xl.file("worksheets/sheet".concat(id, ".xml"), _data);
    xl.file("worksheets/_rels/sheet".concat(id, ".xml.rels"), generateSheetXmlRels({
      id: id,
      images: _images
    }));
    if (_images) {
      xl.file("drawings/drawing".concat(id, ".xml"), generateDrawingXml({
        images: _images
      }));
      xl.file("drawings/_rels/drawing".concat(id, ".xml.rels"), generateDrawingXmlRels({
        images: _images,
        sheetId: id
      }));
      // Copy images to `xl/media` folder.
      for (var _iterator2 = _createForOfIteratorHelperLoose(_images), _step2; !(_step2 = _iterator2()).done;) {
        var image = _step2.value;
        // According to `JSZip` docs:
        // https://stuk.github.io/jszip/documentation/api_jszip/file_data.html
        // `.file()` function supports `data` argument of type:
        // * String
        // * ArrayBuffer
        // * Uint8Array
        // * Buffer
        // * Blob
        // * Promise
        // * Nodejs stream
        xl.file("media/".concat(getImageFileName(image, {
          sheetId: id,
          sheetImages: _images
        })), image.content);
      }
    }
  }
  return zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    compression: 'deflate'
  });
}
//# sourceMappingURL=writeXlsxFileBrowser.js.map