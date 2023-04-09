// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/formatters/rows/formatRow.js

import generateCell from './cell.js'
import getCellStyleProperties from './getCellStyleProperties.js'

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
			if (cell === undefined || cell === null) {
				return ''
			}

			const {
				height
			} = cell

			const cellStyleProperties = getCellStyleProperties(cell)

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
				if (type !== Date && type !== Number && type !== 'Formula') { // && type !== Integer) {
					throw new Error('`format` can only be used on `Date`, `Number` or `"Formula"` cells') // or `Integer` cells')
				}
			} else {
				if (type === Date) {
					format = dateFormat
				}
			}

			let cellStyleId
			if (
				format ||
				customFont ||
				cellStyleProperties
			) {
				cellStyleId = getStyle(cellStyleProperties || {}, { format })
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