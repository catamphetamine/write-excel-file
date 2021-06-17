import generateColumnDescription from './column'

/**
 * Generates columns description.
 * This is optional and is skipped unless a column has some `style` defined.
 * @param  {object[]} columns
 * @return {string}
 */
export default function generateColumnsDescription(schema) {
  // `cols` format is described here:
  // https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.spreadsheet.columns.aspx
	return `<cols>${schema ? schema.map(generateColumnDescription).join('') : ''}</cols>`
}