import generateColumnDescription from './column.js'

/**
 * Generates columns description.
 * This is optional and is skipped unless a column has some `style` defined.
 * @param  {object[]} options.schema
 * @param  {object[]} options.columns
 * @return {string}
 */
export default function generateColumnsDescription({ schema, columns }) {
	if (schema || columns) {
	  // `cols` format is described here:
	  // https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.spreadsheet.columns.aspx
		const description = (schema || columns).map(generateColumnDescription).join('')
		if (description) {
			return `<cols>${description}</cols>`
		}
	}
	// An empty `<cols></cols>` element would produce an error in some versions of Excel.
	// https://gitlab.com/catamphetamine/write-excel-file/-/issues/6
	return ''
}