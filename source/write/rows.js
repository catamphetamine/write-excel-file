// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/formatters/rows/generatorRows.js

import generateRow from './row'

export default function generateRows(data, { schema, formatStyles, sharedStrings }) {
	if (schema) {
		data = [schema.map((column) => ({
			type: String,
			fontWeight: 'bold',
			value: column.column
		}))].concat(data.map((row) => schema.map(
			(column) => ({
				...column,
				value: column.value(row)
			})
		)))
	}
	return data.map((row, index) => generateRow(row, index, { formatStyles, sharedStrings })).join('')
}