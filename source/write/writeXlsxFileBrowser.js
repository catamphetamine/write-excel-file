// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/zipcelx.js

import JSZip from 'jszip'
import FileSaver from 'file-saver'

import workbookXML from './statics/workbook.xml'
import workbookXMLRels from './statics/workbook.xml.rels'
import rels from './statics/rels'
import contentTypes from './statics/[Content_Types].xml'

import generateWorksheet from './worksheet'
import initStyles from './styles'
import initSharedStrings from './sharedStrings'

export default function writeXlsxFile(data, { fileName, schema, columns, fontFamily, fontSize } = {}) {
  return generateXlsxFile(data, { schema, columns, fontFamily, fontSize }).then((blob) => {
    if (fileName) {
      return FileSaver.saveAs(blob, fileName)
    }
    return blob
  })
}

/**
 * Writes an *.xlsx file into a "blob".
 * https://github.com/egeriis/zipcelx/issues/68
 * "The reason if you want to send the excel file or store it natively on Cordova/capacitor app".
 * @return {Blob}
 */
function generateXlsxFile(data, { schema, columns, fontFamily, fontSize }) {
  const zip = new JSZip()

  zip.file('_rels/.rels', rels)
  zip.file('[Content_Types].xml', contentTypes)

  const { getSharedStringsXml, getSharedString } = initSharedStrings()
  const { getStylesXml, getStyle } = initStyles({ fontFamily, fontSize })
  const worksheet = generateWorksheet(data, { schema, columns, getStyle, getSharedString, customFont: fontFamily || fontSize })

  const xl = zip.folder('xl')
  xl.file('workbook.xml', workbookXML)
  xl.file('styles.xml', getStylesXml())
  xl.file('sharedStrings.xml', getSharedStringsXml())
  xl.file('_rels/workbook.xml.rels', workbookXMLRels)
  xl.file('worksheets/sheet1.xml', worksheet)

  return zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
}