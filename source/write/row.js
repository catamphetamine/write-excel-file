// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/formatters/rows/formatRow.js

import generateCell from './cell'
import { BOLD_FONT_WEIGHT_STYLE_ID } from './styles'

import Integer from '../types/Integer'

export default function generateRow(row, rowIndex, { formatStyles, sharedStrings }) {
	// To ensure the row number starts as in Excel.
	const rowNumber = rowIndex + 1
	const rowCells = row
		.map((cell, columnIndex) => {
			const {
				type,
				value,
				format,
				fontWeight
			} = cell
			if (format && type !== Date &&  type !== Number && type !== Integer) {
				throw new Error('`format` can only be used on `Date`, `Number` or `Integer` cells')
			}
			if (fontWeight && type !== String) {
				throw new Error('`fontWeight` can only be used on `String` cells')
			}
			if (format && fontWeight) {
				throw new Error('`fontWeight` and `format` can\'t be used on a cell at the same time')
			}
			let cellStyleId
			if (fontWeight) {
				cellStyleId = BOLD_FONT_WEIGHT_STYLE_ID
			} else if (format) {
				cellStyleId = formatStyles[format]
			}
			// if (columnDefinition.format !== undefined || columnDefinition.formatId !== undefined) {
			// 	cellStyleId = formatStyles[columnDefinition.format || String(columnDefinition.formatId)]
			// }
			return generateCell(
				rowNumber,
				columnIndex,
				value,
				type,
				cellStyleId,
				sharedStrings
			)
		})
		.join('')
	return `<row r="${rowNumber}">${rowCells}</row>`
}