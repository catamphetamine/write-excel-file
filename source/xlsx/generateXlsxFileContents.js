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
import validateSheetData from './validateSheetData.js'
import initializeSheets from './initializeSheets.js'
import getSheetData from '../getSheetData/getSheetData.js'

import getWrittenFiles from './helpers/features/getWrittenFiles.js'
import isObject from './helpers/isObject.js'

/**
 * Creates contents (files) an `*.xlsx` file.
 * @param {SheetData|Object[]|Sheet[]} arg1
 * @param {object} arg2 — If `arg1` is `SheetData`, `arg2` is `SheetOptions` and `arg3` is `Options`. If `arg1` is `Sheet[]`, `arg2` is `Options`.
 * @param {object} [arg3] — If `arg1` is `SheetData`, `arg2` is `SheetOptions` and `arg3` is `Options`. If `arg1` is `Sheet[]`, `arg2` is `Options`.
 * @return {Record<string,string|Blob>} A map of files that exist inside an `.xlsx` file.
 */
export default function generateXlsxFileContents(arg1, arg2, arg3) {
  const { sheets: sheetsDataAndOptions, options } = getArguments(arg1, arg2, arg3)

  const sheetsData = sheetsDataAndOptions.map(sheet => sheet.data)
  let sheetsOptions = sheetsDataAndOptions.map(sheet => sheet.options)

  sheetsOptions = setSheetNames(sheetsOptions)

  // Here's a small hack for `conditionalFormatting` feature support.
  // `.xlsx` format is weird and has many quirks.
  // One of those quirks is each conditional formatting rule has to be assigned a globally-unique ID.
  // That itself wouldn't be an issue if that globally-unique ID could be any string,
  // but `.xlsx` format specification complicates things by demanding it to be
  // a zero-based integer index (0, 1, 2, ...) referencing a specific `<dxf>` element in "styles.xml" file.
  // So a conditional formatting rule ID can't be just "sheet1-rule2", it has to be specifically
  // an index of this rule in the list of all rules for all sheets in a given `.xlsx` file.
  // Because a sheet-specific file tranform function doesn't have access to other sheets' options,
  // here it manually sets the global indexes of all conditional formatting rules,
  // and it has to do so without mutating any input arguments.
  sheetsOptions = setConditionalFormattingRulesGlobalIndexes(sheetsOptions)

  const features = getFeatures(options.features)

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
    getCellStyles
  } = initializeSheets(sheetsData, sheetsOptions, options)

  files['[Content_Types].xml'] = generateContentTypesXml({
    sheetIds: sheets.map(_ => _.sheetId),
    features,
    sheetsOptions
  })

  files['_rels/.rels'] = generateRelsXml({
    features,
    sheetsOptions
  })

  files['xl/_rels/workbook.xml.rels'] = generateWorkbookXmlRels({
    sheetIds: sheets.map(_ => _.sheetId),
    features,
    sheetsOptions
  })

  files['xl/workbook.xml'] = generateWorkbookXml({
    sheetIdsAndNames: sheets.map(({ sheetId, sheetName }) => ({ sheetId, sheetName })),
    features,
    sheetsOptions
  })

  let sheetIndex = 0
  for (const { sheetId, sheetXmlParameters } of sheets) {
    const sheetOptions = sheetsOptions[sheetIndex]

    files[`xl/worksheets/sheet${sheetId}.xml`] = generateSheetXml(sheetXmlParameters, features)

    files[`xl/worksheets/_rels/sheet${sheetId}.xml.rels`] = generateSheetXmlRels({
      sheetIndex,
      sheetId,
      sheetOptions,
      features
    })

    files[`xl/drawings/drawing${sheetId}.xml`] = generateDrawingXml({
      sheetIndex,
      sheetId,
      sheetOptions,
      features
    })

    files[`xl/drawings/_rels/drawing${sheetId}.xml.rels`] = generateDrawingXmlRels({
      sheetIndex,
      sheetId,
      sheetOptions,
      features
    })

    sheetIndex++
  }

  writeFiles(getWrittenFiles(features, sheetsOptions, { read: readFile }))

  // After sheets' XML was generated, it can generate "styles.xml" and "sharedStrings.xml".
  files['xl/styles.xml'] = generateStylesXml(getCellStyles(), sheetsOptions, features)
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

function getArguments(arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    if (arg1.length === 0 || Array.isArray(arg1[0])) {
      // `arg1` is `SheetData`
      validateSheetData(arg1)
      return {
        sheets: [{
          data: arg1,
          options: arg2 || {}
        }],
        options: arg3 || {}
      }
    } else if (isObject(arg1[0])) {
      // `arg1` is either `Sheet[]` or `Object[]`
      // Check for legacy parameter `schema`.
      if (isObject(arg2) && Array.isArray(arg2.schema)) {
        throw new Error('`schema` parameter was removed, use `columns` parameter instead')
      }
      if (isObject(arg2) && Array.isArray(arg2.columns)) {
        // `arg1` is `Object[]`.
        // Don't remove `columns` property from `arg2` because it's still required there
        // to apply the column `width`.
        return getArguments(getSheetData(arg1, arg2.columns), arg2, arg3)
      }
      // `arg1` is `Sheet[]`
      return {
        sheets: arg1.map(({ data, ...options }) => {
          if (!data) {
            throw new Error('`data` property is required for each sheet')
          }
          validateSheetData(data)
          return {
            data,
            options: options || {}
          }
        }),
        options: arg2 || {}
      }
    } else {
      throw new Error('Invalid first argument: must be either sheet data — an array of arrays — or an array of sheet objects')
    }
  } else {
    throw new Error('Invalid first argument: must be an array')
  }
}

// Sets a sheet name for each sheet.
function setSheetNames(sheetsOptions) {
  return sheetsOptions.map((sheetOptions, sheetIndex) => ({
    ...sheetOptions,
    sheet: sheetOptions.sheet || `Sheet${sheetIndex + 1}`
  }))
}

// Sets a `_globalIndex: number` property on each conditional formatting rule.
function setConditionalFormattingRulesGlobalIndexes(sheetsOptions) {
  let globalIndex = 0
  return sheetsOptions.map((sheetOptions) => ({
    ...sheetOptions,
    conditionalFormatting: sheetOptions.conditionalFormatting &&
      sheetOptions.conditionalFormatting.map((conditionalFormattingRule) => ({
        ...conditionalFormattingRule,
        // `++` operator returns the value before the increment.
        _globalIndex: globalIndex++
      }))
  }))
}