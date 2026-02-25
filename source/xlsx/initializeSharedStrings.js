export default function initializeSharedStrings() {
	const sharedStrings = []
	const sharedStringIdByString = {}

	return {
		getSharedStrings() {
			return sharedStrings
		},

		findOrCreateSharedString(string) {
      let id = sharedStringIdByString[string]
      if (id === undefined) {
				id = sharedStrings.length
				sharedStringIdByString[string] = id
				sharedStrings.push(string)
      }
      return id
		}
	}
}