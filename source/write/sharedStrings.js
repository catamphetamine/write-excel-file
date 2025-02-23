import $text from '../xml/sanitizeText.js'

export default function initSharedStrings() {
	const sharedStrings = []
	const sharedStringsIndex = {}

	return {
		getSharedStrings() {
			return sharedStrings
		},

		getSharedString(string) {
      let id = sharedStringsIndex[string]
      if (id === undefined) {
				id = String(sharedStrings.length)
				sharedStringsIndex[string] = id
				sharedStrings.push(string)
      }
      return id
		}
	}
}