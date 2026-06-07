import generateRow from './row.js'

export default function generateSheetData(tag, sheetData, parameters) {
	const sheetDataXml = sheetData.map((row, index) => {
		return generateRow(tag, row, index, parameters)
	}).join('')

	return tag('sheetData', null, sheetDataXml)
}