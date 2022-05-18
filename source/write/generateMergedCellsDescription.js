import generateCellNumber from './generateCellNumber.js'

// Supports "merging cells" across columns and rows.
// https://rdrr.io/cran/openxlsx/man/mergeCells.html
//
// XML example:
// `<sheetData>...</sheetData><mergeCells count="1"><mergeCell ref="A2:C3"/></mergeCells>`
//
// Configuration example:
//
// rows:
// [
//   [...],
//   [
//     { type: String, value: 'abc', span: 3, rowSpan: 2 },
//     { ... },
//     { ... }
//   ],
//   [...],
// ]

export default function generateMergedCellsDescription(data, { schema }) {
	if (schema) {
		return ''
	}
	const mergedCells = []
	let rowIndex = 0
	while (rowIndex < data.length) {
		const row = data[rowIndex]
		let columnIndex = 0
		while (columnIndex < row.length) {
			const { span, rowSpan } = row[columnIndex]
			if (span || rowSpan) {
				const rowNumber = rowIndex + 1
				mergedCells.push(
					generateCellNumber(columnIndex, rowNumber) +
					':' +
					generateCellNumber(
						columnIndex + (span ? span - 1 : 0),
						rowNumber + (rowSpan ? rowSpan - 1 : 0)
					)
				)
			}
			columnIndex++
		}
		rowIndex++
	}
	if (mergedCells.length === 0) {
		return ''
	}
	return `<mergeCells count="${mergedCells.length}">` +
		mergedCells.map(coordinates => `<mergeCell ref="${coordinates}"/>`).join('') +
		'</mergeCells>'
}