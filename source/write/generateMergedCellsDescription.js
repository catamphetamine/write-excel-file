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
			const cell = row[columnIndex]
			if (cell) {
				const { span = 1, rowSpan = 1 } = cell

				if (span > 1 || rowSpan > 1) {
					// Validate that `span`-ning or `rowSpan`-ning cells only overlap
					// `null` or `undefined` ones. Especially that `span`-ning or `rowSpan`-ning cells
					// don't overlap other `span`-ning or `rowSpan`-ning cells.
					validateSpanningCellsOverlap({ data, rowIndex, columnIndex, span, rowSpan })

					// Add "merged cells" entry.
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

// Validate that a `span`-ning / `rowSpan`-ning cell doesn't overlap
// with other cells, especially `span`-ning / `rowSpan`-ning ones,
// because those ones would make MS Office 2007 Excel say:
// "Excel found unreadable content in 'file.xlsx'.
//  Do you want to recover the contents of this workbook?
//  If you trust the source of this workbook, click Yes".
function validateSpanningCellsOverlap({ data, rowIndex, columnIndex, span, rowSpan }) {
	let i = rowIndex
	while (i <= rowIndex + (rowSpan - 1)) {
		let j = columnIndex
		while (j <= columnIndex + (span - 1)) {
			const cell = data[i][j]
			if (i > rowIndex || j > columnIndex) {
				if (cell !== null && cell !== undefined) {
					throw new Error(`[write-excel-file] When using \`span\` or \`rowSpan\` parameters, all hidden overlapped cells should be represented by \`null\`s or \`undefined\`s. Cell at row ${rowIndex + 1} and column ${columnIndex + 1} is configured with \`span\` ${span} and \`rowSpan\` ${rowSpan}. Cell at row ${i + 1} and column ${j + 1} is neither \`null\` nor \`undefined\`: ${JSON.stringify(cell)}`)
				}
			}
			j++
		}
		i++
	}
}