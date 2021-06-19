// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/formatters/rows/formatRow.js

import generateCell from './cell'

// import Integer from '../types/Integer'

export default function generateRow(row, rowIndex, { getStyle, getSharedString }) {
	// To ensure the row number starts as in Excel.
	const rowNumber = rowIndex + 1
	const rowCells = row
		.map((cell, columnIndex) => {
			const {
				type,
				value,
				format,
				align,
				fontWeight
			} = cell
			if (format && type !== Date &&  type !== Number) { // && type !== Integer) {
				throw new Error('`format` can only be used on `Date`, `Number` cells') // or `Integer` cells')
			}
			// if (fontWeight && type !== String) {
			// 	throw new Error('`fontWeight` can only be used on `String` cells')
			// }
			// if (format && fontWeight) {
			// 	throw new Error('`fontWeight` and `format` can\'t be used on a cell at the same time')
			// }
			let cellStyleId
			if (fontWeight || align || format) {
				cellStyleId = getStyle({ fontWeight, align, format })
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
	return `<row r="${rowNumber}">${rowCells}</row>`
}