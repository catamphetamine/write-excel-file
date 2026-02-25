import initializeStyles from './initializeStyles.js'
import getInitializeStylesParameters from './initializeStyles.parameters.js'
import initializeSharedStrings from './initializeSharedStrings.js'
import validateSheetName from './validateSheetName.js'
import isObject from './helpers/isObject.js'

export default function initializeSheets({
  sheetNames,
  getHeaderStyle,
  fontFamily,
  fontSize,
  features,
	multipleSheetsParameters,
  ...restParameters
}) {
  const { getSharedStrings, findOrCreateSharedString } = initializeSharedStrings()

  const { getCellStyles, findOrCreateCellStyle } = initializeStyles({
    fontFamily,
    fontSize,
    features,
    ...getInitializeStylesParameters(restParameters, multipleSheetsParameters, features)
  })

  // Validate sheet name.
  for (const sheetName of sheetNames) {
    validateSheetName(sheetName)
  }

  const generateSheetXmlParameters = []
  let sheetIndex = 0
  for (const sheetName of sheetNames) {
    const {
      data,
      schema,
      columns,
      ...sheetParameters
    } = restParameters
		validateData(data, { schema, multipleSheetsParameters })
		// Validate the cases when this function is called directly in tests, etc.
		if (multipleSheetsParameters === undefined) {
			throw new Error('`multipleSheetsParameters` parameter not found')
		}
		const getParameterForSheet = (parameter) => {
			if (multipleSheetsParameters) {
				return parameter[sheetIndex]
			}
			return parameter
		}
    generateSheetXmlParameters.push({
			...sheetParameters,
			multipleSheetsParameters,
			sheetIndex,
			sheetId: getSheetId(sheetIndex),
			data: getParameterForSheet(data),
			schema: schema && getParameterForSheet(schema),
			columns: columns && getParameterForSheet(columns),
			customFont: fontFamily || fontSize,
			getHeaderStyle,
			findOrCreateCellStyle,
			findOrCreateSharedString
		})
    sheetIndex++
  }

  return {
    sheets: sheetNames.map((sheetName, _i) => {
			// Reassign the `_i` variable to prevent "closure" bug when in `generateSheetXml()` function
			// the `_i` value is always equal to the last sheet's index.
			const sheetIndex = _i
			return {
				sheetId: getSheetId(sheetIndex),
				sheetName,
				generateSheetXmlParameters: generateSheetXmlParameters[sheetIndex]
			}
    }),
    getSharedStrings,
    getCellStyles,
		multipleSheetsParameters
  }
}

function getSheetId(sheetIndex) {
	return String(sheetIndex + 1)
}

function validateData(data, { schema, multipleSheetsParameters }) {
	if (multipleSheetsParameters) {
		if (!Array.isArray(data) || (data.length > 0 && !Array.isArray(data[0]))) {
			throw new TypeError('Expected `data` to be an array of arrays of rows')
		}
		for (const sheetData of data) {
			validateSheetDataRows(sheetData, { schema })
		}
	} else {
		if (!Array.isArray(data)) {
			throw new TypeError('Expected `data` to be an array of rows')
		}
		validateSheetDataRows(data, { schema })
	}
}

function validateSheetDataRows(data, { schema }) {
	for (const row of data) {
		if (row !== null && row !== undefined) {
			if (schema) {
				if (isObject(row)) {
					return
				} else {
					throw new Error('Expected `data` rows to be objects')
				}
			} else {
				if (Array.isArray(row)) {
					return
				} else {
					throw new Error('Expected `data` rows to be arrays')
				}
			}
		}
	}
}