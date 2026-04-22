export default function getSheetData(objects, columns) {
	// Create header row.
	let headerRow
	// If at least one column has a header
	// then a header row will be rendered.
	// Otherwise, there will be no header row.
	if (columns.some(column => column.header)) {
		headerRow = columns.map(({ header }) => {
			return header || null
		})
	}

	return (headerRow ? [headerRow] : []).concat(
		objects.map((object, objectIndex) => columns.map(
			({ cell }) => cell(object, objectIndex)
		))
	)
}