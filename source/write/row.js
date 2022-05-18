// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/formatters/rows/formatRow.js

import generateCell from './cell.js'

// import Integer from '../types/Integer.js'

export default function generateRow(row, rowIndex, {
	getStyle,
	getSharedString,
	customFont,
	dateFormat,
	usesSchema
}) {
	// To ensure the row number starts as in Excel.
	const rowNumber = rowIndex + 1
	let rowHeight
	const rowCells = row
		.map((cell, columnIndex) => {
			const {
				align,
				alignVertical,
				fontWeight,
				fontStyle,
				height,
				wrap,
				color,
				backgroundColor,
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
			} = cell

			let {
				type,
				value,
				format
			} = cell

			if (isEmpty(value)) {
				value = null
			} else {
				// Get cell value type.
				if (type === undefined) {
					if (!usesSchema) {
						type = detectValueType(value)
					}
					if (type === undefined) {
						// The default cell value type is `String`.
						type = String
						value = String(value)
					}
				}
			}

			// Validate `format` property.
			if (format) {
				if (type !== Date &&  type !== Number) { // && type !== Integer) {
					throw new Error('`format` can only be used on `Date` or `Number` cells') // or `Integer` cells')
				}
			} else {
				if (type === Date) {
					format = dateFormat
				}
			}

			let cellStyleId
			if (
				fontWeight ||
				fontStyle ||
				align ||
				alignVertical ||
				format ||
				wrap ||
				color ||
				backgroundColor ||
				borderColor ||
				borderStyle ||
				leftBorderColor ||
				leftBorderStyle ||
				rightBorderColor ||
				rightBorderStyle ||
				topBorderColor ||
				topBorderStyle ||
				bottomBorderColor ||
				bottomBorderStyle ||
				customFont
			) {
				cellStyleId = getStyle(
					fontWeight,
					fontStyle,
					align,
					alignVertical,
					format,
					wrap,
					color,
					backgroundColor,
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
				)
			}

			if (height) {
				if (rowHeight === undefined || rowHeight < height) {
					rowHeight = height
				}
			}

			return generateCell(
				rowNumber,
				columnIndex,
				value,
				type,
				cellStyleId,
				getSharedString
			)
		})
		.join('')

	return `<row r="${rowNumber}"` +
		(rowHeight ? ` ht="${rowHeight}" customHeight="1"` : '') +
		'>' +
		rowCells +
		'</row>'
}

function isEmpty(value) {
  return value === undefined || value === null || value === ''
}

function detectValueType(value) {
  switch (typeof value) {
    case 'string':
      return String
    case 'number':
      return Number
    case 'boolean':
      return Boolean
    default:
      if (value instanceof Date) {
        return Date
      }
  }
}