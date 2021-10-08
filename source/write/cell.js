// import Integer, { isInteger } from '../types/Integer'
// import URL, { isURL } from '../types/URL'
// import Email, { isEmail } from '../types/Email'

import generateCellNumber from './generateCellNumber'
import convertDateToExcelSerial from './convertDateToExcelSerial'

export default function generateCell(
  rowNumber,
  columnIndex,
  value,
  type,
  cellStyleId,
  getSharedString
) {
  // Empty cells could be skipped completely,
  // if they don't have a style applied to them,
  // like border or background color.
  if (isEmpty(value)) {
    if (!cellStyleId) {
      return ''
    }
  }

  // Validate date format.
  if (type === Date && !cellStyleId) {
    throw new Error('No "format" has been specified for a Date cell')
  }

  let xml = `<c r="${generateCellNumber(columnIndex, rowNumber)}"`

  // Available formatting style IDs (built-in in Excel):
  // https://xlsxwriter.readthedocs.io/format.html#format-set-num-format
  // `2` — 0.00
  // `3` —  #,##0
  if (cellStyleId) {
    // From the attribute s="12" we know that the cell's formatting is stored at the 13th (zero-based index) <xf> within the <cellXfs>
    xml += ` s="${cellStyleId}"`
  }

  if (isEmpty(value)) {
    return xml + '/>'
  }

  // The default cell type is `String`.
  if (type === undefined) {
    type = String
    value = String(value)
  }

  value = getXlsxValue(type, value, getSharedString)
  type = getXlsxType(type)

  // The default value for `t` is `"n"` (a number or a date).
  if (type) {
    xml += ` t="${type}"`
  }

  return xml + '>' +
    (type === 'inlineStr' ? '<is><t>' : '<v>') +
    value +
    (type === 'inlineStr' ? '</t></is>' : '</v>') +
    '</c>'
}

/**
 * Escapes text for XML: replaces ">" with "&gt;", etc.
 * https://en.wikipedia.org/wiki/Character_encodings_in_HTML#HTML_character_references
 * @param  {string} string
 * @return {string}
 */
function escapeString(string) {
  return string
    .replace(/&/g, '&amp;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
}

function isEmpty(value) {
  return value === undefined || value === null || value === ''
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
    // case Email:
    // case URL:
      return 's'
      // // "inlineStr" type is used instead of "s" to avoid creating a "shared strings" index.
      // return 'inlineStr'

    case Number:
    // case Integer:
      // `n` is the default cell type (if no `t` has been specified).
      // return 'n'
      return

    case Date:
      // `n` is the default cell type (if no `t` has been specified).
      // return 'n'
      return

    case Boolean:
      return 'b'

    default:
      throw new Error(`Unknown schema type: ${type && type.name || type}`)
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
    // case Email:
    // case URL:
      // if (type === Email && !isEmail(value)) {
      //   throw new Error(`Invalid cell value: ${value}. Expected an Email`)
      // }
      // if (type === URL && !isURL(value)) {
      //   throw new Error(`Invalid cell value: ${value}. Expected a URL`)
      // }
      value = escapeString(value)
      return getSharedString(value)

    case Number:
    // case Integer:
      if (typeof value !== 'number') {
        throw new Error(`Invalid cell value: ${value}. Expected a number`)
      }
      // if (type === Integer && !isInteger(value)) {
      //   throw new Error(`Invalid cell value: ${value}. Expected an Integer`)
      // }
      return String(value)

    case Date:
      if (!(value instanceof Date)) {
        throw new Error(`Invalid cell value: ${value}. Expected a Date`)
      }
      // "d" type doesn't seem to work.
      // return value.toISOString()
      return String(convertDateToExcelSerial(value))

    case Boolean:
      return value ? '1' : '0'

    default:
      throw new Error(`Unknown schema type: ${type && type.name || type}`)
  }
}