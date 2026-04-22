import generateColumnDescription from './column.js'

/**
 * Generates columns description.
 * @param  {object[]} [columns]
 * @return {string}
 */
export default function generateColumnsDescription(columns) {
	if (columns) {
	  // `cols` format is described here:
	  // https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.spreadsheet.columns.aspx
		const columnDescriptions = columns.map(generateColumnDescription)
		// If any column has any custom properties, create a `<cols/>` element.
		// An empty `<cols></cols>` element would produce an error in some versions of Excel.
		// https://gitlab.com/catamphetamine/write-excel-file/-/issues/6
		if (columnDescriptions.some(_ => _)) {
			return `<cols>${columnDescriptions.join('')}</cols>`
		}
	}

	// An empty `<cols></cols>` element would produce an error in some versions of Excel.
	// https://gitlab.com/catamphetamine/write-excel-file/-/issues/6
	return ''
}