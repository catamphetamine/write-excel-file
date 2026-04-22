export default function validateSheetData(data) {
	if (!Array.isArray(data)) {
		throw new TypeError('Expected sheet data to be an array of rows')
	}
	for (const row of data) {
		if (Array.isArray(row)) {
			return
		} else {
			throw new Error('Expected each sheet data row to be an array')
		}
	}
}