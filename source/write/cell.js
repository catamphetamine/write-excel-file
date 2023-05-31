// import Integer, { isInteger } from '../types/Integer.js'
// import URL, { isURL } from '../types/URL.js'
// import Email, { isEmail } from '../types/Email.js'

import $text from '../xml/sanitizeText.js'

import generateCellNumber from './generateCellNumber.js'
import convertDateToExcelSerial from './convertDateToExcelSerial.js'

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
  if (value === null) {
    if (!cellStyleId) {
      return ''
    }
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

  if (value === null) {
    return xml + '/>'
  }

  // Validate date format.
  if (type === Date && !cellStyleId) {
    throw new Error('No "format" has been specified for a Date cell')
  }

  value = getXlsxValue(type, value, getSharedString)
  type = getXlsxType(type)

  // The default value for `t` is `"n"` (a number or a date).
  if (type) {
    xml += ` t="${type}"`
  }

  const [openingTags, closingTags] = getOpeningAndClosingTags(type)

  return xml + '>' +
    openingTags +
    value +
    closingTags +
    '</c>'
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

    case 'Formula':
      return 'f'

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
      if (typeof value !== 'string') {
        throw new Error(`Invalid cell value: ${value}. Expected a string`)
      }
      // if (type === Email && !isEmail(value)) {
      //   throw new Error(`Invalid cell value: ${value}. Expected an Email`)
      // }
      // if (type === URL && !isURL(value)) {
      //   throw new Error(`Invalid cell value: ${value}. Expected a URL`)
      // }
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
      if (typeof value !== 'boolean') {
        throw new Error(`Invalid cell value: ${value}. Expected a boolean`)
      }
      return value ? '1' : '0'

    case 'Formula':
      if (typeof value !== 'string') {
        throw new Error(`Invalid cell value: ${value}. Expected a string`)
      }
      return $text(value)

    default:
      throw new Error(`Unknown schema type: ${type && type.name || type}`)
  }
}

const TAG_BRACKET_LEFT_REGEXP = /</g

function getOpeningAndClosingTags(xlsxType) {
  const openingTags = getOpeningTags(xlsxType)
  const closingTags = openingTags.replace(TAG_BRACKET_LEFT_REGEXP, '</')
  return [openingTags, closingTags]
}

function getOpeningTags(xlsxType) {
  switch (xlsxType) {
    case 'inlineStr':
      return '<is><t>'
    case 'f':
      return '<f>'
    default:
      return '<v>'
  }
}