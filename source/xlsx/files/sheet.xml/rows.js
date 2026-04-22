import generateRow from './row.js'

export default function generateRows(data, {
	findOrCreateCellStyle,
	findOrCreateSharedString,
	hasDefaultFont,
	dateFormat,
	features
}) {
	return data.map((row, index) => generateRow(row, index, {
		findOrCreateCellStyle,
		findOrCreateSharedString,
		hasDefaultFont,
		dateFormat,
		features
	})).join('')
}