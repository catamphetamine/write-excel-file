import initializeStyles from './initializeStyles.js'
import initializeSharedStrings from './initializeSharedStrings.js'
import validateSheetName from './validateSheetName.js'

export default function initializeSheets(sheetsData, sheetsOptions, globalOptions) {
  const { getSharedStrings, findOrCreateSharedString } = initializeSharedStrings()

  // const sheetsDefaultFonts = sheetsOptions.map((sheetOptions) => {
	// 	const { fontFamily, fontSize } = sheetOptions
  //   if (fontFamily || fontSize) {
	// 		return { fontFamily, fontSize }
	// 	}
  // })

	const defaultFont = getDefaultFont(globalOptions)
  const { getCellStyles, findOrCreateCellStyle } = initializeStyles(defaultFont)

	// Get sheet names.
	const sheetNames = sheetsOptions.map(sheetOptions => sheetOptions.sheet)

  // Validate sheet names.
  for (const sheetName of sheetNames) {
    validateSheetName(sheetName)
  }

  const sheetXmlParameters = []
  let sheetIndex = 0
  while (sheetIndex < sheetNames.length) {
    sheetXmlParameters.push({
			sheetData: sheetsData[sheetIndex],
			sheetOptions: sheetsOptions[sheetIndex],
			sheetIndex,
			sheetId: getSheetId(sheetIndex),
			hasDefaultFont: Boolean(defaultFont),
			// hasDefaultFont: Boolean(sheetsDefaultFonts[sheetIndex]),
			// findOrCreateCellStyle: (style) => findOrCreateCellStyle(style, sheetIndex),
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
				sheetXmlParameters: sheetXmlParameters[sheetIndex]
			}
    }),
    getSharedStrings,
    getCellStyles
  }
}

function getSheetId(sheetIndex) {
	return String(sheetIndex + 1)
}

function getDefaultFont(globalOptions) {
	const { fontFamily, fontSize } = globalOptions
	if (fontFamily || typeof fontSize === 'number') {
		return { fontFamily, fontSize }
	}
}