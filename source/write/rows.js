// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/formatters/rows/generatorRows.js

import generateRow from './row.js'

export default function generateRows(data, {
	schema,
	headerStyle,
	getStyle,
	getSharedString,
	customFont,
	dateFormat
}) {
	if (schema) {
		let header = []
		for (const column of schema) {
			// If at least one schema column has a title,
			// then print a header row.
			if (column.column) {
				header = [schema.map((column) => ({
					type: String,
					value: column.column,
					align: column.align,
					// `headerStyle` also overwrites `align`, if specified.
					...(headerStyle || DEFAULT_HEADER_STYLE)
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
	return data.map((row, index) => generateRow(row, index, {
		getStyle,
		getSharedString,
		customFont,
		dateFormat,
		usesSchema: schema !== undefined
	})).join('')
}

const DEFAULT_HEADER_STYLE = {
	fontWeight: 'bold'
}