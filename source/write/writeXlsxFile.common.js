import generateWorksheet from './worksheet'
import initStyles from './styles'
import initSharedStrings from './sharedStrings'

export function generateSheets({
  data,
  sheetNames,
  schema,
  columns,
  headerStyle,
  fontFamily,
  fontSize,
  dateFormat
}) {
  const { getSharedStringsXml, getSharedString } = initSharedStrings()
  const { getStylesXml, getStyle } = initStyles({ fontFamily, fontSize })

  if (!sheetNames) {
    sheetNames = ['Sheet1']
    data = [data]
    if (schema) {
      schema = [schema]
    }
  }

  const worksheets = []
  let sheetIndex = 0
  for (const sheet of sheetNames) {
    worksheets.push(generateWorksheet(data[sheetIndex], {
      schema: schema && schema[sheetIndex],
      columns,
      headerStyle,
      getStyle,
      getSharedString,
      customFont: fontFamily || fontSize,
      dateFormat
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