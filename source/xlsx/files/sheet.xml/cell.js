import $textContent from '../../../xml/escapeTextContent.js'
import getOpeningTagMarkup from '../../../xml/getOpeningTagMarkup.js'
import getClosingTagMarkup from '../../../xml/getClosingTagMarkup.js'
import getSelfClosingTagMarkup from '../../../xml/getSelfClosingTagMarkup.js'

import getCellCoordinate from '../../helpers/getCellCoordinate.js'
import convertDateToExcelSerial from './helpers/convertDateToExcelSerial.js'

export default function generateCell(
  rowNumber,
  columnIndex,
  value,
  type,
  cellStyleId,
  findOrCreateSharedString
) {
  // Empty cells could be skipped completely,
  // if they don't have a style applied to them,
  // like border or background color.
  if (value === null) {
    if (cellStyleId === undefined) {
      return ''
    }
  }

  const cellAttributes = {
    r: getCellCoordinate(rowNumber - 1, columnIndex)
  }

  // Available formatting style IDs (built-in in Excel):
  // https://xlsxwriter.readthedocs.io/format.html#format-set-num-format
  // `2` — 0.00
  // `3` —  #,##0
  if (cellStyleId !== undefined) {
    // From the attribute s="12" we know that the cell's formatting is stored at the 13th (zero-based index) <xf> within the <cellXfs>
    cellAttributes.s = String(cellStyleId)
  }

  if (value === null) {
    return getSelfClosingTagMarkup('c', cellAttributes)
  }

  // Validate date format.
  if (type === Date && cellStyleId === undefined) {
    throw new Error(`No \`format\` was specified for a \`Date\` value in a cell in row ${rowNumber} column ${columnIndex + 1}. Either specify a \`format\` for this cell or specify a default global one by passing \`dateFormat\` option to \`writeXlsxFile()\` function`)
  }

  const xlsxValue = getXlsxValue(type, value, findOrCreateSharedString)
  const xlsxType = getXlsxType(type)

  // The default value for `t` is `"n"` (a number or a date).
  if (xlsxType) {
    cellAttributes.t = xlsxType
  }

  const [openingTags, closingTags] = getOpeningAndClosingTags(type)

  return getOpeningTagMarkup('c', cellAttributes) +
    openingTags +
    xlsxValue +
    closingTags +
    getClosingTagMarkup('c')
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
      return 's'
      // I don't know why did I comment out the use of "inlineStr" XLSX type.
      // Perhaps there were some issues with it. Or perhaps there weren't and everyone else just uses "s".
      // // "inlineStr" type is used instead of "s" to avoid creating a "shared strings" index.
      // return 'inlineStr'

    case Number:
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
      return

    default:
      throw new Error(`Unknown type: ${type && type.name || type}`)
  }
}

function getXlsxValue(type, value, findOrCreateSharedString) {
  // Available Excel cell types:
  // https://github.com/SheetJS/sheetjs/blob/19620da30be2a7d7b9801938a0b9b1fd3c4c4b00/docbits/52_datatype.md
  //
  // Some other document (seems to be old):
  // http://webapp.docx4java.org/OnlineDemo/ecma376/SpreadsheetML/ST_CellType.html
  //
  switch (type) {
    case String:
      if (typeof value !== 'string') {
        throw new Error(`Invalid cell value: ${value}. Expected a string`)
      }
      return findOrCreateSharedString(value)

    case Number:
      if (typeof value !== 'number') {
        throw new Error(`Invalid cell value: ${value}. Expected a number`)
      }
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
      return $textContent(value)

    default:
      throw new Error(`Unknown type: ${type && type.name || type}`)
  }
}

const TAG_BRACKET_LEFT_REGEXP = /</g

function getOpeningAndClosingTags(type) {
  const openingTags = getOpeningTags(type)
  const closingTags = openingTags.replace(TAG_BRACKET_LEFT_REGEXP, '</')
  return [openingTags, closingTags]
}

function getOpeningTags(type) {
  switch (type) {
    // case 'inlineStr':
    //   return '<is><t>'
    case 'Formula':
      return '<f>'
    default:
      return '<v>'
  }
}