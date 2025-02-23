// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/zipcelx.js

import JSZip from 'jszip'
import FileSaver from 'file-saver'

import getImageFileName from './getImageFileName.js'

import generateWorkbookXml from './statics/workbook.xml.js'
import generateWorkbookXmlRels from './statics/workbook.xml.rels.js'
import rels from './statics/rels.js'
import generateContentTypesXml from './statics/[Content_Types].xml.js'
import generateDrawingXml from './statics/drawing.xml.js'
import generateDrawingXmlRels from './statics/drawing.xml.rels.js'
import generateSheetXmlRels from './statics/sheet.xml.rels.js'

import { generateSheets } from './writeXlsxFile.common.js'

export default function writeXlsxFile(data, { fileName, ...rest } = {}) {
  return generateXlsxFile(data, rest).then((blob) => {
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
function generateXlsxFile(data, {
  sheet: sheetName,
  sheets: sheetNames,
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
  const zip = new JSZip()

  const {
    sheets,
    getSharedStringsXml,
    getStylesXml
  } = generateSheets({
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
  })

  zip.file('_rels/.rels', rels)

  zip.file('[Content_Types].xml', generateContentTypesXml({ images, sheets }))

  const xl = zip.folder('xl')
  xl.file('_rels/workbook.xml.rels', generateWorkbookXmlRels({ sheets }))
  xl.file('workbook.xml', generateWorkbookXml({ sheets, stickyRowsCount, stickyColumnsCount }))
  xl.file('styles.xml', getStylesXml())
  xl.file('sharedStrings.xml', getSharedStringsXml())

  for (const { id, data, images } of sheets) {
    xl.file(`worksheets/sheet${id}.xml`, data)
    xl.file(`worksheets/_rels/sheet${id}.xml.rels`, generateSheetXmlRels({ id, images: undefined }))
    if (images) {
      xl.file(`drawings/drawing${id}.xml`, generateDrawingXml({ images }))
      xl.file(`drawings/_rels/drawing${id}.xml.rels`, generateDrawingXmlRels({ images, sheetId: id }))
      // Copy images to `xl/media` folder.
      for (const image of images) {
        // According to `JSZip` docs:
        // https://stuk.github.io/jszip/documentation/api_jszip/file_data.html
        // `.file()` function supports `data` argument of type:
        // * String
        // * ArrayBuffer
        // * Uint8Array
        // * Buffer
        // * Blob
        // * Promise
        // * Nodejs stream
        xl.file(`media/${getImageFileName(image, { sheetId: id, sheetImages: images })}`, image.content)
      }
    }
  }

  return zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    compression: 'deflate'
  })
}