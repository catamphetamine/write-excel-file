// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/formatters/rows/generatorRows.js

import generateRow from './row'

export default function generateRows(data, { schema, getStyle, getSharedString }) {
	if (schema) {
		let header = [];
		for (const column of schema) {
			// If at least one schema column has a title,
			// then print a header row.
			if (column.column) {
				header = [schema.map((column) => ({
					type: String,
					fontWeight: 'bold',
					align: column.align,
					value: column.column
				}))]
				break
			}
		}
		data = header.concat(data.map((row) => schema.map(
			(column) => ({
				...column,
				value: column.value(row)
			})
		)))
	}
	return data.map((row, index) => generateRow(row, index, { getStyle, getSharedString })).join('')
}