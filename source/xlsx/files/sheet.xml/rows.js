import generateRow from './row.js'

export default function generateRows(data, {
	rowOptions,
	findOrCreateCellStyle,
	findOrCreateSharedString,
	hasDefaultFont,
	dateFormat,
	features
}) {
	return data.map((row, index) => generateRow(row, index, {
		rowOption: rowOptions && rowOptions[index],
		findOrCreateCellStyle,
		findOrCreateSharedString,
		hasDefaultFont,
		dateFormat,
		features
	})).join('')
}