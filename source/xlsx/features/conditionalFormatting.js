import escapeTextContent from '../../xml/escapeTextContent.js'

import hasFill from '../helpers/hasFill.js'
import getFillXml from '../helpers/getFillXml.js'
import hasBorder from '../helpers/hasBorder.js'
import getBorderXml from '../helpers/getBorderXml.js'
import hasFont from '../helpers/hasFont.js'
import getFontXml from '../helpers/getFontXml.js'
import getCellCoordinate from '../helpers/getCellCoordinate.js'

function normalizeParameters(parameters, { multipleSheetsParameters, sheetIndex }) {
	const { conditionalFormatting: conditionalFormattingParameter } = parameters
	if (conditionalFormattingParameter) {
		const conditionalFormattingPerSheet = multipleSheetsParameters ? conditionalFormattingParameter : [conditionalFormattingParameter]
		const conditionalFormatting = typeof sheetIndex === 'number' ? conditionalFormattingPerSheet[sheetIndex] : undefined
		return { conditionalFormatting, conditionalFormattingPerSheet }
	}
	return {}
}

export default {
	files: {
		transform: {
			'xl/worksheets/sheet{id}.xml': {
				// For some weird reason, Excel 2007 demands `<conditionalFormatting/>` element to go before `<drawing/>` element.
				// Because `<drawing/>` element is added before any of the `insert()`s of any features,
				// this feature has to use a `transform()` function instead of an `insert()` function.
				transform: (xml, parameters, { multipleSheetsParameters, sheetIndex }) => {
					const { conditionalFormatting, conditionalFormattingPerSheet } = normalizeParameters(parameters, { multipleSheetsParameters, sheetIndex })
					if (conditionalFormatting) {
						const conditionalFormattingXml = getConditionalFormattingRulesXml({
							sheetIndex,
							conditionalFormatting,
							conditionalFormattingPerSheet
						})
						return xml.replace('</sheetData>', '</sheetData>' + conditionalFormattingXml)
					}
					return xml
				},

				// These parameters will be passed through to the function above.
				parameters: (availableParameters) => {
					const { conditionalFormatting } = availableParameters
					return { conditionalFormatting }
				}
			},

			'xl/styles.xml': {
				insert: (parameters, { multipleSheetsParameters }) => {
					const { conditionalFormattingPerSheet } = normalizeParameters(parameters, { multipleSheetsParameters })
					if (conditionalFormattingPerSheet) {
						return getConditionalFormattingStylesXml({ conditionalFormattingPerSheet })
					}
				},

				// These parameters will be passed through to the function above.
				parameters: (availableParameters) => {
					const { conditionalFormatting } = availableParameters
					return { conditionalFormatting }
				}
			}
		}
	}
}

function getConditionalFormattingRulesXml({
	sheetIndex,
	conditionalFormatting: conditionalFormattingRules,
	conditionalFormattingPerSheet
}) {
	let xml = ''

	let i = 0
	for (const conditionalFormattingRule of conditionalFormattingRules) {
		const {
			cellRange: {
				from,
				to
			},
			condition: {
				formula,
				operator,
				value,
				value2
			}
		} = conditionalFormattingRule

		// Cell range example: "A1:C5"
		const cellRange = getCellCoordinate(from.row - 1, from.column - 1) + ':' + getCellCoordinate(to.row - 1, to.column - 1)

		xml += `<conditionalFormatting sqref="${cellRange}">`

		// The priority attribute in conditional formatting XML is an integer value that must be a positive integer between 1 and the total number of conditional formatting rules on the worksheet.
		// * The value is defined by the W3C XML Schema int datatype.
		// * The valid range is dynamic, starting from 1 (highest priority) and ending at the total number of rules on that specific worksheet (lowest priority).
		// * Each priority value must be unique for all rules on the same worksheet. Changing the priority of one rule will automatically adjust the priorities of other rules to maintain uniqueness and order.
		// * A lower numeric value indicates a higher priority (e.g., priority 1 is the highest possible priority).
		const priority = i + 1

		// The `dxfId` attribute in ".xlsx" (OpenXML) files is a zero-based integer index (0, 1, 2, ...)
		// referencing a specific differential format record (`<dxf>`) within the "styles.xml" file.
		const dxfId = getConditionalFormattingRuleGlobalIndex({
			conditionalFormattingRuleIndex: i,
			conditionalFormattingPerSheet,
			sheetIndex
		})

		// There're a lot of possible `type`s of a `<cfRule/>`.
		// The full list could be viewed by googling for "ST_CfType".

		if (formula) {
			xml += `<cfRule type="expression" dxfId="${dxfId}" priority="${priority}">`
			xml += `<formula>${escapeTextContent(formula)}</formula>`
			xml += '</cfRule>'
		} else if (operator) {
			xml += `<cfRule type="cellIs" operator="${getXlsxOperatorName(operator)}" dxfId="${dxfId}" priority="${priority}">`
			xml += `<formula>${escapeTextContent(formatValue(value))}</formula>`
			if (getXlsxOperatorName(operator) === 'between') {
				xml += `<formula>${escapeTextContent(formatValue(value2))}</formula>`
			}
			xml += '</cfRule>'
		} else {
			throw new Error(`Invalid conditional formatting rule:\n${JSON.stringify(conditionalFormattingRule, null, 2)}`)
		}

		xml += '</conditionalFormatting>'

		i++
	}

	return xml
}

function formatValue(value) {
	if (typeof value === 'string') {
		return '"' + value + '"'
	}
	return String(value)
}

function getConditionalFormattingRuleGlobalIndex({
	conditionalFormattingRuleIndex,
	conditionalFormattingPerSheet,
	sheetIndex
}) {
	let sheetRulesIndexOffset = 0

	let i = 0
	while (i < sheetIndex) {
		if (conditionalFormattingPerSheet[i]) {
			sheetRulesIndexOffset += conditionalFormattingPerSheet[i].length
		}
		i++
	}

	return sheetRulesIndexOffset + conditionalFormattingRuleIndex
}

function getXlsxOperatorName(operator) {
	switch (operator) {
		case '<':
			return 'lessThan'
		case '>':
			return 'greaterThan'
		case '<=':
			return 'lessThanOrEqual'
		case '>=':
			return 'greaterThanOrEqual'
		case '=':
			return 'equal'
		case '!=':
			return 'notEqual'
		case '...':
			return 'between'
		default:
			throw new Error(`Unknown conditional formatting operator: ${operator}`)
	}
}

function getConditionalFormattingStylesXml({ conditionalFormattingPerSheet }) {
	let totalConditionalFormattingRulesCount = 0

	for (const conditionalFormattingOfSheet of conditionalFormattingPerSheet) {
		if (conditionalFormattingOfSheet) {
			totalConditionalFormattingRulesCount += conditionalFormattingOfSheet.length
		}
	}

	let xml = ''

	xml += `<dxfs count="${totalConditionalFormattingRulesCount}">`

	for (const conditionalFormattingOfSheet of conditionalFormattingPerSheet) {
		if (conditionalFormattingOfSheet) {
			for (const conditionalFormattingRule of conditionalFormattingOfSheet) {
				const {
					style: {
						fontFamily,
						fontSize,
						fontWeight,
						fontStyle,
						textDecoration,
						textColor,
						backgroundColor,
						fillPatternStyle,
						fillPatternColor,
						borderColor,
						borderStyle,
						leftBorderColor,
						leftBorderStyle,
						rightBorderColor,
						rightBorderStyle,
						topBorderColor,
						topBorderStyle,
						bottomBorderColor,
						bottomBorderStyle
					}
				} = conditionalFormattingRule

				xml += '<dxf>'

				const font = {
					fontFamily,
					fontSize,
					fontWeight,
					fontStyle,
					textDecoration,
					textColor
				}

				if (hasFont(font)) {
					// It seems that the "conditional formatting" feature in the XLSX specification
					// doesn't support setting custom `fontFamily` or `fontSize` for some weird reason.
					// https://github.com/catamphetamine/write-excel-file/pull/10#issuecomment-3960778016
					if (fontFamily) {
						throw new Error('Conditional formatting can\'t be used to override font family')
					}
					if (typeof fontSize === 'number') {
						throw new Error('Conditional formatting can\'t be used to override font size')
					}
					xml += getFontXml(font)
				}

				const fill = {
					backgroundColor,
					fillPatternStyle,
					fillPatternColor
				}

				if (hasFill(fill)) {
					xml += getFillXml(fill, { conditionalFormatting: true })
				}

				const border = {
					borderColor,
					borderStyle,
					leftBorderColor,
					leftBorderStyle,
					rightBorderColor,
					rightBorderStyle,
					topBorderColor,
					topBorderStyle,
					bottomBorderColor,
					bottomBorderStyle
				}

				if (hasBorder(border)) {
					xml += getBorderXml(border)
				}

				xml += '</dxf>'
			}
		}
	}

	xml += '</dxfs>'

	return xml
}