import getCellStyleProperties from './getCellStyleProperties.js'

// Supports "merging cells" across columns and rows.
// https://rdrr.io/cran/openxlsx/man/mergeCells.html
//
// Returned result example for merged cells range "A2:C3":
// { mergedCells: [ [0, 1], [2, 2] ] }
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

export default function processMergedCells(data, { schema }) {
	const mergedCells = []

	if (schema) {
		return {
			data,
			mergedCells
		}
	}

	let cloneData = () => {
		// The code will apply the style from the originating "merged" cells
		// to their adjacent `null` cells, so clone `data` to prevent mutating it.
		data = data.slice()
		// Also clone each row of `data`.
		let i = 0
		while (i < data.length) {
			data[i] = data[i].slice()
			i++
		}
		// `data` has been cloned. No need to clone it again.
		cloneData = () => data
		// Return the cloned `data`.
		return data
	}

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
					processSpanningCells({ data, rowIndex, columnIndex, span, rowSpan, cloneData })

					// Add "merged cells" entry:
					// `[ [fromRowIndex, fromColumnIndex], [toRowIndex, toColumnIndex] ]`.
					mergedCells.push([
						[rowIndex, columnIndex],
						[
							rowIndex + (rowSpan ? rowSpan - 1 : 0),
							columnIndex + (span ? span - 1 : 0)
						]
					])
				}
			}
			columnIndex++
		}
		rowIndex++
	}

	return {
		data,
		mergedCells
	}
}

// Validate that a `span`-ning / `rowSpan`-ning cell doesn't overlap
// with other cells, especially `span`-ning / `rowSpan`-ning ones,
// because those ones would make MS Office 2007 Excel say:
// "Excel found unreadable content in 'file.xlsx'.
//  Do you want to recover the contents of this workbook?
//  If you trust the source of this workbook, click Yes".
function processSpanningCells({ data, rowIndex, columnIndex, span, rowSpan, cloneData }) {
	const cellStyleProperties = getCellStyleProperties(data[rowIndex][columnIndex])

	if (cellStyleProperties) {
		data = cloneData()
	}

	let i = rowIndex
	while (i <= rowIndex + (rowSpan - 1)) {
		let j = columnIndex
		while (j <= columnIndex + (span - 1)) {
			const cell = data[i][j]
			if (i > rowIndex || j > columnIndex) {
				// Validate that all hidden cells are `null` or `undefined`.
				if (cell !== null && cell !== undefined) {
					throw new Error(`[write-excel-file] When using \`span\` or \`rowSpan\` parameters, all hidden overlapped cells should be represented by \`null\`s or \`undefined\`s. Cell at row ${rowIndex + 1} and column ${columnIndex + 1} is configured with \`span\` ${span} and \`rowSpan\` ${rowSpan}. Cell at row ${i + 1} and column ${j + 1} is neither \`null\` nor \`undefined\`: ${JSON.stringify(cell)}`)
				}
				// Apply the style from the original cell to this `null` cell.
				// https://gitlab.com/catamphetamine/write-excel-file/-/issues/43
				if (cellStyleProperties) {
					data[i][j] = cellStyleProperties
				}
			}
			j++
		}
		i++
	}
}