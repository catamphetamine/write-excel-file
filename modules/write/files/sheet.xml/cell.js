function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// import Integer, { isInteger } from '../types/Integer.js'
// import URL, { isURL } from '../types/URL.js'
// import Email, { isEmail } from '../types/Email.js'

import $text from '../../../xml/sanitizeText.js';
import getAttributesString from '../../../xml/getAttributesString.js';
import generateCellNumber from './helpers/generateCellNumber.js';
import convertDateToExcelSerial from './helpers/convertDateToExcelSerial.js';
export default function generateCell(rowNumber, columnIndex, value, type, cellStyleId, getSharedString) {
  // Empty cells could be skipped completely,
  // if they don't have a style applied to them,
  // like border or background color.
  if (value === null) {
    if (!cellStyleId) {
      return '';
    }
  }
  var cellAttributes = {
    r: generateCellNumber(columnIndex, rowNumber)
  };

  // Available formatting style IDs (built-in in Excel):
  // https://xlsxwriter.readthedocs.io/format.html#format-set-num-format
  // `2` — 0.00
  // `3` —  #,##0
  if (cellStyleId) {
    // From the attribute s="12" we know that the cell's formatting is stored at the 13th (zero-based index) <xf> within the <cellXfs>
    cellAttributes.s = cellStyleId;
  }
  if (value === null) {
    return "<c".concat(getAttributesString(cellAttributes), "/>");
  }

  // Validate date format.
  if (type === Date && !cellStyleId) {
    throw new Error('No "format" has been specified for a Date cell');
  }
  value = getXlsxValue(type, value, getSharedString);
  type = getXlsxType(type);

  // The default value for `t` is `"n"` (a number or a date).
  if (type) {
    cellAttributes.t = type;
  }
  var _getOpeningAndClosing = getOpeningAndClosingTags(type),
    _getOpeningAndClosing2 = _slicedToArray(_getOpeningAndClosing, 2),
    openingTags = _getOpeningAndClosing2[0],
    closingTags = _getOpeningAndClosing2[1];
  return "<c".concat(getAttributesString(cellAttributes), ">") + openingTags + value + closingTags + '</c>';
}
function getXlsxType(type) {
  // Available Excel cell types:
  // https://github.com/SheetJS/sheetjs/blob/19620da30be2a7d7b9801938a0b9b1fd3c4c4b00/docbits/52_datatype.md
  //
  // Some other document (seems to be old):
  // http://webapp.docx4java.org/OnlineDemo/ecma376/SpreadsheetML/ST_CellType.html
  //
  switch (type) {
    case String:
    case "String":
      // case Email:
      // case URL:
      return 's';
    // // "inlineStr" type is used instead of "s" to avoid creating a "shared strings" index.
    // return 'inlineStr'

    case Number:
    case "Number":
      // case Integer:
      // `n` is the default cell type (if no `t` has been specified).
      // return 'n'
      return;
    case Date:
    case "Date":
      // `n` is the default cell type (if no `t` has been specified).
      // return 'n'
      return;
    case Boolean:
    case "Boolean":
      return 'b';
    case 'Formula':
      return 'f';
    default:
      throw new Error("Unknown schema type: ".concat(type && type.name || type));
  }
}
function getXlsxValue(type, value, getSharedString) {
  // Available Excel cell types:
  // https://github.com/SheetJS/sheetjs/blob/19620da30be2a7d7b9801938a0b9b1fd3c4c4b00/docbits/52_datatype.md
  //
  // Some other document (seems to be old):
  // http://webapp.docx4java.org/OnlineDemo/ecma376/SpreadsheetML/ST_CellType.html
  //
  switch (type) {
    case String:
    case "String":
      // case Email:
      // case URL:
      if (typeof value !== 'string') {
        throw new Error("Invalid cell value: ".concat(value, ". Expected a string"));
      }
      // if (type === Email && !isEmail(value)) {
      //   throw new Error(`Invalid cell value: ${value}. Expected an Email`)
      // }
      // if (type === URL && !isURL(value)) {
      //   throw new Error(`Invalid cell value: ${value}. Expected a URL`)
      // }
      return getSharedString(value);
    case Number:
    case "Number":
      // case Integer:
      if (typeof value !== 'number') {
        throw new Error("Invalid cell value: ".concat(value, ". Expected a number"));
      }
      // if (type === Integer && !isInteger(value)) {
      //   throw new Error(`Invalid cell value: ${value}. Expected an Integer`)
      // }
      return String(value);
    case Date:
    case "Date":
      if (!(value instanceof Date)) {
        throw new Error("Invalid cell value: ".concat(value, ". Expected a Date"));
      }
      // "d" type doesn't seem to work.
      // return value.toISOString()
      return String(convertDateToExcelSerial(value));
    case Boolean:
    case "Boolean":
      if (typeof value !== 'boolean') {
        throw new Error("Invalid cell value: ".concat(value, ". Expected a boolean"));
      }
      return value ? '1' : '0';
    case 'Formula':
      if (typeof value !== 'string') {
        throw new Error("Invalid cell value: ".concat(value, ". Expected a string"));
      }
      return $text(value);
    default:
      throw new Error("Unknown schema type: ".concat(type && type.name || type));
  }
}
var TAG_BRACKET_LEFT_REGEXP = /</g;
function getOpeningAndClosingTags(xlsxType) {
  var openingTags = getOpeningTags(xlsxType);
  var closingTags = openingTags.replace(TAG_BRACKET_LEFT_REGEXP, '</');
  return [openingTags, closingTags];
}
function getOpeningTags(xlsxType) {
  switch (xlsxType) {
    case 'inlineStr':
      return '<is><t>';
    case 'f':
      return '<f>';
    default:
      return '<v>';
  }
}
//# sourceMappingURL=cell.js.map