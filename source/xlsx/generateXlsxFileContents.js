import generateWorkbookXml from './files/workbook.xml.js'
import generateWorkbookXmlRels from './files/workbook.xml.rels.js'
import generateRelsXml from './files/rels.js'
import generateContentTypesXml, { getDrawingContentTypeXml } from './files/[Content_Types].xml.js'
import generateDrawingXml, { DRAWING_XML_START, DRAWING_XML_END } from './files/drawing.xml.js'
import generateDrawingXmlRels from './files/drawing.xml.rels.js'
import generateSheetXml from './files/sheet.xml/sheet.xml.js'
import { DRAWING_REFERENCE_XML } from './files/sheet.xml/drawingReference.js'
import generateSheetXmlRels, { getDrawingRelationshipXml } from './files/sheet.xml.rels.js'
import generateSharedStringsXml from './files/sharedStrings.xml.js'
import generateStylesXml from './files/styles.xml.js'

import getFeatures from './getFeatures.js'

import initializeSheets from './initializeSheets.js'
import getInitializeSheetsParameters from './initializeSheets.parameters.js'

import getContentTypesParameters from './files/[Content_Types].xml.parameters.js'
import getRelsParameters from './files/rels.parameters.js'
import getWorkbookParameters from './files/workbook.xml.parameters.js'
import getWorkbookRelsParameters from './files/workbook.xml.rels.parameters.js'
import getSheetXmlRelsParameters from './files/sheet.xml.rels.parameters.js'
import getDrawingXmlParameters from './files/drawing.xml.parameters.js'
import getDrawingXmlRelsParameters from './files/drawing.xml.rels.parameters.js'

import getWrittenFiles from './helpers/features/getWrittenFiles.js'

/**
 * @param {SheetData|object[]} — Spreadsheet data
 * @param {object} — Options
 * @return {Record<string,string|Blob>} A map of files that exist inside an `.xlsx` file.
 */
export default function generateXlsxFileContents(data, options = {}) {
  const {
    features: customFeatures,
    ...parameters
  } = options

  const features = getFeatures(customFeatures)

  const files = {}

  const readFile = (path) => files[path]
  // const fileExists = (path) => Boolean(files[path])

  const writeFiles = (filesToWrite) => {
    for (const path of Object.keys(filesToWrite)) {
      validateFilePath(path)
      validateFileContent(path, filesToWrite[path])
      files[path] = filesToWrite[path]
    }
  }

  const {
    sheets,
    getSharedStrings,
    getCellStyles,
    multipleSheetsParameters
  } = initializeSheets(getInitializeSheetsParameters(parameters, data, features))

  files['[Content_Types].xml'] = generateContentTypesXml({
    sheetIds: sheets.map(_ => _.sheetId),
    ...getContentTypesParameters(parameters, multipleSheetsParameters, features)
  })

  files['_rels/.rels'] = generateRelsXml(
    getRelsParameters(parameters, multipleSheetsParameters, features)
  )

  files['xl/_rels/workbook.xml.rels'] = generateWorkbookXmlRels({
    sheetIds: sheets.map(_ => _.sheetId),
    ...getWorkbookRelsParameters(parameters, multipleSheetsParameters, features)
  })

  files['xl/workbook.xml'] = generateWorkbookXml({
    sheetIdsAndNames: sheets.map(({ sheetId, sheetName }) => ({ sheetId, sheetName })),
    ...getWorkbookParameters(parameters, multipleSheetsParameters, features)
  })

  let sheetIndex = 0
  for (const { sheetId, generateSheetXmlParameters } of sheets) {
    files[`xl/worksheets/sheet${sheetId}.xml`] = generateSheetXml(generateSheetXmlParameters, features)

    files[`xl/worksheets/_rels/sheet${sheetId}.xml.rels`] = generateSheetXmlRels({
      sheetIndex,
      sheetId,
      ...getSheetXmlRelsParameters(parameters, multipleSheetsParameters, features)
    })

    files[`xl/drawings/drawing${sheetId}.xml`] = generateDrawingXml({
      sheetIndex,
      sheetId,
      ...getDrawingXmlParameters(parameters, multipleSheetsParameters, features)
    })

    files[`xl/drawings/_rels/drawing${sheetId}.xml.rels`] = generateDrawingXmlRels({
      sheetIndex,
      sheetId,
      ...getDrawingXmlRelsParameters(parameters, multipleSheetsParameters, features)
    })

    sheetIndex++
  }

  writeFiles(getWrittenFiles(features, parameters, { multipleSheetsParameters, read: readFile }))

  // After sheets' XML was generated, it can generate "styles.xml" and "sharedStrings.xml".
  files['xl/styles.xml'] = generateStylesXml(getCellStyles(), multipleSheetsParameters, features)
  files['xl/sharedStrings.xml'] = generateSharedStringsXml(getSharedStrings())

  // (minor minimization) Remove unused `drawing${id}.xml` files.
  removeUnusedDrawings(files, sheets)

  return files
}

// (minor minimization)
//
// For each `xl/drawings/drawing${id}.xml`, see if it has no actual content,
// i.e. the `<xdr:wsDr>` element has no child elements.
// If that's the case, remove `xl/drawings/drawing${sheetId}.xml` and `xl/drawings/drawing${sheetId}.xml.rels`,
// and also remove `<drawing r:id="..."/>` element from `xl/worksheets/sheet${sheetId}.xml`
// and the corresponding `<Relationship Id="..." .../>` element from `xl/worksheets/_rels/sheet${sheetId}.xml.rels`
// and the corresponding `<Override/> element from `[Content_Types].xml`.
//
function removeUnusedDrawings(files, sheets) {
  for (const { sheetId } of sheets) {
    if (files[`xl/drawings/drawing${sheetId}.xml`] === DRAWING_XML_START + DRAWING_XML_END) {
      delete files[`xl/drawings/drawing${sheetId}.xml`]
      delete files[`xl/drawings/_rels/drawing${sheetId}.xml.rels`]

      removeSubstring(files, `xl/worksheets/sheet${sheetId}.xml`, DRAWING_REFERENCE_XML)
      removeSubstring(files, `xl/worksheets/_rels/sheet${sheetId}.xml.rels`, getDrawingRelationshipXml(sheetId))
      removeSubstring(files, '[Content_Types].xml', getDrawingContentTypeXml(sheetId))
    }
  }
}

function removeSubstring(files, key, substring) {
  if (!files[key]) {
    throw new Error(`File not found: ${key}`)
  }
  if (files[key].indexOf(substring) < 0) {
    throw new Error(`Substring "${substring}" not found in "${key}"`)
  }
  files[key] = files[key].replace(substring, '')
}

function validateFilePath(path) {
  if (path[0] === '/') {
    throw new Error(`File path must not start with a slash (/)`)
  }
}

function validateFileContent(path, content) {
  if (!content) {
    throw new Error(`File \`content\` not specified: ${path}`)
  }
}