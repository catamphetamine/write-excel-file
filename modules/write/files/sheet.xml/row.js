function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/formatters/rows/formatRow.js

import generateCell from './cell.js';
import getCellStyleProperties from './helpers/getCellStyleProperties.js';
import getAttributesString from '../../../xml/getAttributesString.js';

// import Integer from '../types/Integer.js'

export default function generateRow(row, rowIndex, _ref) {
  var getStyle = _ref.getStyle,
    getSharedString = _ref.getSharedString,
    customFont = _ref.customFont,
    dateFormat = _ref.dateFormat,
    usesSchema = _ref.usesSchema;
  // To ensure the row number starts as in Excel.
  var rowNumber = rowIndex + 1;
  var rowHeight;
  var rowCells = row.map(function (cell, columnIndex) {
    if (cell === undefined || cell === null) {
      return '';
    }
    var height = cell.height;
    var cellStyleProperties = getCellStyleProperties(cell);
    var type = cell.type,
      value = cell.value,
      format = cell.format;
    if (isEmpty(value)) {
      value = null;
    } else {
      // Get cell value type.
      if (type === undefined) {
        if (!usesSchema) {
          type = detectValueType(value);
        }
        if (type === undefined) {
          // The default cell value type is `String`.
          type = String;
          value = String(value);
        }
      }
    }

    // Validate `format` property.
    if (format) {
      if (type !== Date && type !== Number && type !== String && type !== 'Formula') {
        // && type !== Integer) {
        throw new Error('`format` can only be used on `Date`, `Number`, `String` or `"Formula"` cells'); // or `Integer` cells')
      }
      if (type === String && format !== '@') {
        throw new Error('`String` cells only support "@" `format`');
      }
    } else {
      if (type === Date) {
        format = dateFormat;
      }
    }
    var cellStyleId;
    if (format || customFont || cellStyleProperties) {
      cellStyleId = getStyle(cellStyleProperties || {}, {
        format: format
      });
    }
    if (height) {
      if (rowHeight === undefined || rowHeight < height) {
        rowHeight = height;
      }
    }
    return generateCell(rowNumber, columnIndex, value, type, cellStyleId, getSharedString);
  }).join('');
  var rowAttributes = {
    r: rowNumber
  };
  if (rowHeight) {
    rowAttributes.ht = rowHeight;
    rowAttributes.customHeight = 1;
  }
  return "<row".concat(getAttributesString(rowAttributes), ">") + rowCells + '</row>';
}
function isEmpty(value) {
  return value === undefined || value === null || value === '';
}
function detectValueType(value) {
  switch (_typeof(value)) {
    case 'string':
      return String;
    case 'number':
      return Number;
    case 'boolean':
      return Boolean;
    default:
      if (value instanceof Date) {
        return Date;
      }
  }
}
//# sourceMappingURL=row.js.map