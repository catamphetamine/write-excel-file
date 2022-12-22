import generateWorksheet from './worksheet.js'
import initStyles from './styles.js'
import initSharedStrings from './sharedStrings.js'
import validateSheetName from './validateSheetName.js'

export function generateSheets({
  data,
  sheetName,
  sheetNames,
  schema,
  columns,
  headerStyle,
  fontFamily,
  fontSize,
  orientation,
  stickyRowsCount,
  stickyColumnsCount,
  dateFormat
}) {
  const { getSharedStringsXml, getSharedString } = initSharedStrings()
  const { getStylesXml, getStyle } = initStyles({ fontFamily, fontSize })

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

  if (!sheetNames) {
    sheetNames = [sheetName || 'Sheet1']
    data = [data]
    if (columns) {
      columns = [columns]
    }
    if (schema) {
      schema = [schema]
    }
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
      headerStyle,
      getStyle,
      getSharedString,
      customFont: fontFamily || fontSize,
      dateFormat,
      orientation,
      stickyRowsCount,
      stickyColumnsCount,
      sheetId: sheetIndex + 1
    }))
    sheetIndex++
  }

  return {
    sheets: sheetNames.map((sheetName, i) => ({
      id: i + 1,
      name: sheetName,
      data: worksheets[i]
    })),
    getSharedStringsXml,
    getStylesXml
  }
}