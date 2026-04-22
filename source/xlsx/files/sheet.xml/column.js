// import floatToInteger from './helpers/floatToInteger.js'

export default function generateColumnDescription(column, index) {
  // Guards against a developer forgetting to put some columns
  // in the `columns` list.
  // For example, a developer may pass `data` with `7` columns
  // but only specify `6` of them in the `columns` list.
  // Hence, it handles missing column description here.
  if (!column) {
    return ''
  }

  // Get the column width (in characters).
  const { width } = column

  // If no width specified (0 width is not allowed as well), then
  // leave the definition empty and the width will be applied automatically.
  if (!width) {
    return ''
  }

  // To ensure the column number starts as in Excel.
  const columnNumber = index + 1

  // `column` format is described here:
  // https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.spreadsheet.column.aspx
  //
  // `customWidth="1"` is required in order for `width="..."` to be applied.
  // Otherwise, Microsoft Office 2007 Excel wouldn't apply the custom column `width`.
  //
  return `<col min="${columnNumber}" max="${columnNumber}" width="${width}" customWidth="1"/>`
}

// /**
//  * Converts column width in pixels to column width in characters.
//  * Column width is measured as the number of characters of the maximum digit width
//  * of the numbers 0, 1, 2, …, 9 as rendered in the normal style's font.
//  * There are 4 pixels of margin padding (two on each side), plus 1 pixel padding
//  * for the gridlines.
//  * @param {number} widthInPixels — Target column width in pixels.
//  * @return {number}
//  */
//  function getColumnWidthInCharacters(columnWidthInPixels) {
//   // Using the Calibri font as an example,
//   // the maximum width of a digit character
//   // when using font size "11 pt" is equal to 7 pixels (at 96 dpi).
//   // TODO make it configurable?
//   const maximumDigitWidth = 7 // in pixels
//
//   // To translate from pixels to character width, use this calculation:
//   // =Truncate(({pixels}-5)/{Maximum Digit Width} * 100+0.5)/100
//   const characterWidth = floatToInteger((((columnWidthInPixels - 5) / maximumDigitWidth) * 100) + 0.5) / 100
//
//   // To translate from character width to real width, use this calculation:
//   // =Truncate([{Number of Characters} * {Maximum Digit Width} + {5 pixel padding}]/{Maximum Digit Width}*256)/256
//   return floatToInteger((((characterWidth * maximumDigitWidth) + 5) / maximumDigitWidth) * 256) / 256
// }