import getCellAddress from '../../helpers/getCellAddress.js'

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
//     { type: String, value: 'abc', columnSpan: 3, rowSpan: 2 },
//     { ... },
//     { ... }
//   ],
//   [...]
// ]

export default function generateMergedCellsDescription(tag, mergedCells) {
	if (mergedCells.length === 0) {
		return ''
	}

	const mergeCellsXml = mergedCells.map(([from, to], index) => {
		const ref = getCellAddress(from[0], from[1]) + ':' + getCellAddress(to[0], to[1])
		return tag('mergeCell', { ref }, null, index)
	}).join('')

	return tag('mergeCells', { count: mergedCells.length }, mergeCellsXml)
}