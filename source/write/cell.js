import Integer, { isInteger } from '../types/Integer'
import URL, { isURL } from '../types/URL'
import Email, { isEmail } from '../types/Email'

import generateCellNumber from './generateCellNumber'
import convertDateToExcelSerial from './convertDateToExcelSerial'

export default function generateCell(
  rowNumber,
  columnIndex,
  value,
  type,
  cellStyleId,
  sharedStrings
) {
  if (!isEmpty(value)) {
    if (type === undefined) {
      type = String
      value = String(value)
    }

    // Available Excel cell types:
    // https://github.com/SheetJS/sheetjs/blob/19620da30be2a7d7b9801938a0b9b1fd3c4c4b00/docbits/52_datatype.md
    //
    // Some other document (seems to be old):
    // http://webapp.docx4java.org/OnlineDemo/ecma376/SpreadsheetML/ST_CellType.html
    //
    switch (type) {
      case String:
      case Email:
      case URL:
        if (type === Email && !isEmail(value)) {
          throw new Error(`Invalid cell value: ${value}. Expected an Email`)
        }
        if (type === URL && !isURL(value)) {
          throw new Error(`Invalid cell value: ${value}. Expected a URL`)
        }
        type = 's'
        // // "inlineStr" type is used instead of "s" to avoid creating a "shared strings" index.
        // type = 'inlineStr'
        value = escapeString(value)
        let id = sharedStrings.get(value)
        if (id === undefined) {
          id = sharedStrings.add(value)
        }
        value = id
        break

      case Number:
      case Integer:
        if (typeof value !== 'number') {
          throw new Error(`Invalid cell value: ${value}. Expected a number`)
        }
        if (type === Integer && !isInteger(value)) {
          throw new Error(`Invalid cell value: ${value}. Expected an Integer`)
        }
        // `n` is the default cell type (if no `t` has been specified).
        type = undefined // 'n'
        value = String(value)
        break

      case Date:
        if (!(value instanceof Date)) {
          throw new Error(`Invalid cell value: ${value}. Expected a Date`)
        }
        // "d" type doesn't seem to work.
        // type = 'd'
        // value = value.toISOString()
        if (!cellStyleId) {
          throw new Error('No "format" has been specified for a Date cell')
        }
        // `n` is the default cell type (if no `t` has been specified).
        type = undefined // 'n'
        value = convertDateToExcelSerial(value)
        break

      case Boolean:
        type = 'b'
        value = value ? '1' : '0'
        break

      default:
        throw new Error(`Unknown schema type: ${type && type.name || type}`)
    }
  }

  let cellStyle = ''
  // Available formatting style IDs (built-in in Excel):
  // https://xlsxwriter.readthedocs.io/format.html#format-set-num-format
  // `2` — 0.00
  // `3` —  #,##0
  if (cellStyleId) {
    cellStyle = ` s="${cellStyleId}"`
  }

  let valueType = ''
  if (type) {
    valueType = ` t="${type}"`
  }

  return `<c r="${generateCellNumber(columnIndex, rowNumber)}"${valueType}${cellStyle}>${type === 'inlineStr' ? '<is><t>' : '<v>'}${isEmpty(value) ? '' : value}${type === 'inlineStr' ? '</t></is>' : '</v>'}</c>`
}

/**
 * Escapes text for XML: replaces ">" with "&gt;", etc.
 * https://en.wikipedia.org/wiki/Character_encodings_in_HTML#HTML_character_references
 * @param  {string} string
 * @return {string}
 */
function escapeString(string) {
  return string
    .replace(/"/g, '&quot;')
    .replace(/&/g, '&amp;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
    .replace(/\'/g, '&apos;')
}

function isEmpty(value) {
  return value === undefined || value === null || value === ''
}