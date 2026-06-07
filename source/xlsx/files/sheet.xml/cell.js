import sanitizeTextContent from '../../../xml/sanitizeTextContent.js'

import getCellAddress from '../../helpers/getCellAddress.js'
import convertDateToSerialNumber from '../../helpers/convertDateToSerialNumber.js'

export default function generateCell(
  tag,
  {
    value,
    type,
    cellStyleId,
    findOrCreateSharedString
  },
  index,
  rowIndex
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
    r: getCellAddress(rowIndex, index)
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
    return tag('c', cellAttributes, null, index)
  }

  // Validate date format.
  if (type === Date && cellStyleId === undefined) {
    throw new Error(`No \`format\` was specified for a \`Date\` value in a cell in row ${rowIndex + 1} column ${index + 1}. Either specify a \`format\` for this cell or specify a default global one by passing \`dateFormat\` option to \`writeXlsxFile()\` function`)
  }

  const valueTextContent = getValueTextContent(type, value, findOrCreateSharedString)
  const typeAttribute = getTypeAttribute(type)

  // The default value for `t` is `"n"` (a number or a date).
  if (typeAttribute) {
    cellAttributes.t = typeAttribute
  }

  const [valueOpeningTags, valueClosingTags] = getOpeningAndClosingTags(type)

  const cellXml = valueOpeningTags + valueTextContent + valueClosingTags

  return tag('c', cellAttributes, cellXml, index)
}

function getTypeAttribute(type) {
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

function getValueTextContent(type, value, findOrCreateSharedString) {
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
      return String(convertDateToSerialNumber(value))

    case Boolean:
      if (typeof value !== 'boolean') {
        throw new Error(`Invalid cell value: ${value}. Expected a boolean`)
      }
      return value ? '1' : '0'

    case 'Formula':
      if (typeof value !== 'string') {
        throw new Error(`Invalid cell value: ${value}. Expected a string`)
      }
      return sanitizeTextContent(value)

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