import generateCellNumber from './generateCellNumber.js'

// Supports "merging cells" across columns and rows.
// https://rdrr.io/cran/openxlsx/man/mergeCells.html
//
// Returned XML example for merged cells range "A2:C3":
// `<sheetData>...</sheetData><mergeCells count="1"><mergeCell ref="A2:C3"/></mergeCells>`
//
// Data example:
//
// rows:
// [
//   [...],
//   [
//     { type: String, value: 'abc', span: 3, rowSpan: 2 },
//     { ... },
//     { ... }
//   ],
//   [...]
// ]

export default function generateMergedCellsDescription(mergedCells) {
	if (mergedCells.length === 0) {
		return ''
	}

	return `<mergeCells count="${mergedCells.length}">` +
		mergedCells.map(([from, to]) => {
			const coordinates =
				generateCellNumber(from[1], from[0] + 1) +
				':' +
				generateCellNumber(to[1], to[0] + 1)
			return `<mergeCell ref="${coordinates}"/>`
		}).join('') +
		'</mergeCells>'
}