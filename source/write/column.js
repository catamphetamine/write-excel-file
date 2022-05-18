// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/formatters/cols/formatCols.js

import floatToInteger from './floatToInteger.js'

const DATE_COLUMN_DEFAULT_WIDTH = 14

export default function generateColumnDescription(column, index) {
  // Guards against a developer forgetting to put some columns
  // in the `columns` list when not using a `schema`.
  // For example, a developer may pass `data` with `7` columns
  // but only specify `6` of them in the `columns` list.
  // Hence, it handles missing column description here.
  if (!column) {
    return ''
  }

  // Dates usually don't fit in the default column width,
  // so set the default date column width to be a bit wider.
  //
  // `type` property can only be present on a `schema` entry of a column.
  // It's not present on the `columns` parameter when not using a `schema`.
  //
  if (column.type === Date && !column.width) {
    column.width = DATE_COLUMN_DEFAULT_WIDTH
  }

  // If no width specified (0 width is not allowed as well), then
  // leave the definition empty and the width will be applied automatically.
  if (!column.width) {
    return ''
  }

  // To ensure the column number starts as in Excel.
  const columnNumber = index + 1

  // // Column "style".
  // // It's unclear what exactly does it mean.
  // // Something like font, etc.
  // // Is an integer "enum": perhaps, it can be one of the pre-defined styles in an Excel editor.
  // // Perhaps could be omitted.
  // // The default seems to be `1`.
  // const style = column.style ? column.style : 1

  // `column` format is described here:
  // https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.spreadsheet.column.aspx
  //
  // `customWidth="1"` is required in order for `width="..."` to be applied.
  // Otherwise, Microsoft Office 2007 Excel wouldn't apply the custom column `width`.
  //
  return `<col min="${columnNumber}" max="${columnNumber}" width="${column.width}" customWidth="1"/>`

  // The `style` attribute doesn't seem to be required.
  // style="${style}"
}

/**
 * Returns column width in characters.
 * Column width is measured as the number of characters of the maximum digit width
 * of the numbers 0, 1, 2, …, 9 as rendered in the normal style's font.
 * There are 4 pixels of margin padding (two on each side), plus 1 pixel padding
 * for the gridlines.
 * @param {number} widthInPixels — Target column width in pixels.
 * @return {number}
 */
function getColumnWidthInCharacters(columnWidthInPixels) {
  // Using the Calibri font as an example,
  // the maximum digit width of 11 point font size is 7 pixels (at 96 dpi).
  // `6` is for "Calibri" font of size `12`.
  // TODO make it configurable?
  const maximumDigitWidth = 6 // in pixels

  // To translate from pixels to character width, use this calculation:
  // =Truncate(({pixels}-5)/{Maximum Digit Width} * 100+0.5)/100
  const characterWidth = floatToInteger((((columnWidthInPixels - 5) / maximumDigitWidth) * 100) + 0.5) / 100

  // To translate from character width to real width, use this calculation:
  // =Truncate([{Number of Characters} * {Maximum Digit Width} + {5 pixel padding}]/{Maximum Digit Width}*256)/256
  return floatToInteger((((characterWidth * maximumDigitWidth) + 5) / maximumDigitWidth) * 256) / 256
}