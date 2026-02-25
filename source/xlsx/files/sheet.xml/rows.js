import generateRow from './row.js'

export default function generateRows(data, {
	schema,
	getHeaderStyle,
	findOrCreateCellStyle,
	findOrCreateSharedString,
	customFont,
	dateFormat,
	features
}) {
	if (schema) {
		let header = []
		for (const columnSchema of schema) {
			// If at least one schema column has a title specified
			// then it means that the header row should be rendered.
			// Otherwise, it wouldn't be rendered.
			if (columnSchema.column) {
				header = [schema.map((columnSchema) => ({
					type: String,
					value: columnSchema.column,
					align: columnSchema.align,
					// `getHeaderStyle()` overwrites `align`, if `getHeaderStyle()` is specified.
					...(getHeaderStyle ? getHeaderStyle(columnSchema) : DEFAULT_HEADER_STYLE)
				}))]
				break
			}
		}
		data = header.concat(data.map((row) => schema.map(
			(columnSchema) => ({
				...columnSchema,
				...(columnSchema.getCellStyle ? columnSchema.getCellStyle(row) : undefined),
				value: columnSchema.value(row)
			})
		)))
	}
	return data.map((row, index) => generateRow(row, index, {
		findOrCreateCellStyle,
		findOrCreateSharedString,
		customFont,
		dateFormat,
		features,
		usesSchema: schema !== undefined
	})).join('')
}

const DEFAULT_HEADER_STYLE = {
	fontWeight: 'bold'
}