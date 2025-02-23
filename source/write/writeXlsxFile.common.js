import generateWorksheet from './files/sheet.xml/worksheet.js'
import initStyles from './styles.js'
import initSharedStrings from './sharedStrings.js'
import validateSheetName from './validateSheetName.js'

export function generateSheets({
  data,
  sheetName,
  sheetNames,
  schema,
  columns,
  images,
  headerStyle,
  getHeaderStyle,
  fontFamily,
  fontSize,
  orientation,
  stickyRowsCount,
  stickyColumnsCount,
  showGridLines,
  rightToLeft,
  dateFormat
}) {
  const { getSharedStrings, getSharedString } = initSharedStrings()
  const { getStyles, getStyle } = initStyles({ fontFamily, fontSize })

  // Versions before `1.3.4` had a bug:
  // In a "write multiple sheets" scenario, `columns` parameter
  // wasn't required to be an array of `columns` for each sheet.
  if (sheetNames) {
    if (columns) {
      if (!Array.isArray(columns[0])) {
        throw new Error('In a "write multiple sheets" scenario, `columns` parameter must be an array of `columns` for each sheet.');
      }
    }
  }

  // If only a single sheet is being written,
  // convert parameters to arrays as if multiple sheets were being written.
  // This way, the code after this wouldn't bother about the parameters being arrays or not.
  if (!sheetNames) {
    sheetNames = [sheetName || 'Sheet1']
    data = [data]
    if (columns) {
      columns = [columns]
    }
    if (schema) {
      schema = [schema]
    }
    if (images) {
      images = [images]
    }
  }

  // Rename deprecated `headerStyle` parameter to `getHeaderStyle(columnSchema)`.
  if (headerStyle && !getHeaderStyle) {
    getHeaderStyle = () => headerStyle
  }

  // Validate sheet name.
  for (const sheetName of sheetNames) {
    validateSheetName(sheetName)
  }

  const worksheets = []
  let sheetIndex = 0
  for (const sheet of sheetNames) {
    worksheets.push(generateWorksheet(data[sheetIndex], {
      schema: schema && schema[sheetIndex],
      columns: columns && columns[sheetIndex],
      images: images && images[sheetIndex],
      getHeaderStyle,
      getStyle,
      getSharedString,
      customFont: fontFamily || fontSize,
      dateFormat,
      orientation,
      stickyRowsCount,
      stickyColumnsCount,
      showGridLines,
      rightToLeft,
      sheetId: sheetIndex + 1
    }))
    sheetIndex++
  }

  return {
    sheets: sheetNames.map((sheetName, i) => ({
      id: i + 1,
      name: sheetName,
      data: worksheets[i],
      images: images && images[i]
    })),
    getSharedStrings,
    getStyles
  }
}