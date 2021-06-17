function getSharedStringsXml(sharedStrings) {
	let xml = '<?xml version="1.0"?>'
	xml += '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
	for (const string of sharedStrings) {
		xml += `<si><t>${string}</t></si>`
	}
	xml += '</sst>'
	return xml
}

export default class SharedStrings {
	constructor() {
		this.sharedStrings = []
		this.sharedStringsIndex = {}
	}

	get(string) {
		return this.sharedStringsIndex[string]
	}

	add(string) {
		const id = this.sharedStrings.length
		this.sharedStringsIndex[string] = String(id)
		this.sharedStrings.push(string)
		return id
	}

	getXml() {
		return getSharedStringsXml(this.sharedStrings)
	}
}