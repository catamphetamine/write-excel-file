import $text from '../../xml/sanitizeText.js'

export default function generateSharedStringsXml(sharedStrings) {
	let xml = '<?xml version="1.0"?>'
	xml += '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
	for (const string of sharedStrings) {
		const attributes = string.trim().length === string.length ? '' : ' xml:space="preserve"';
		xml += `<si><t${attributes}>`
		xml += $text(string)
		xml += '</t></si>'
	}
	xml += '</sst>'
	return xml
}