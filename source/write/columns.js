import generateColumnDescription from './column'

/**
 * Generates columns description.
 * This is optional and is skipped unless a column has some `style` defined.
 * @param  {object[]} options.schema
 * @param  {object[]} options.columns
 * @return {string}
 */
export default function generateColumnsDescription({ schema, columns }) {
  // `cols` format is described here:
  // https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.spreadsheet.columns.aspx
	return schema || columns ? `<cols>${(schema || columns).map(generateColumnDescription).join('')}</cols>` : ''
}