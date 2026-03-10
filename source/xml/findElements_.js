/**
 * Finds either all elements or a single element in valid XML markup.
 * @param {string} xml — XML markup
 * @param {string} tagName — The name of the element to find
 * @param {boolean} [stopAfterFirstMatch] — Pass `true` to find just one element. Pass `false` or omit to find all elements.
 * @returns {object[]} — A list of found elements, each one represented by an object with propeties: `{ openingTagStartIndex: number, openingTagEndIndex: number, openingTagAttributes: object, selfClosingTag?: boolean, closingTagStartIndex?: number, closingTagEndIndex?: number }`.
 */
export default function findElements_(xml, tagName, stopAfterFirstMatch) {
	const openingTagRegExp = new RegExp('<' + tagName + '(?:\\s+[^>]+|/)?>', stopAfterFirstMatch ? undefined :  'g')
	const closingTagRegExp = new RegExp('</' + tagName + '>')

	const results = []

	let match
	while ((match = openingTagRegExp.exec(xml)) !== null) {
		const attributes = {}
		const attributeRegExp = new RegExp('\\s+([^\\s=>]+)(?:="([^\\s=>]+)")', 'g')
		let attributeMatch
		while ((attributeMatch = attributeRegExp.exec(match[0])) !== null) {
			attributes[attributeMatch[1]] = attributeMatch[2]
		}
		const result = {
			tagName,
			// openingTagMarkup: match[0],
			openingTagStartIndex: match.index,
			openingTagEndIndex: match.index + match[0].length - 1,
			openingTagAttributes: attributes,
			selfClosingTag: false,
			// closingTagMarkup: undefined,
			closingTagStartIndex: undefined,
			closingTagEndIndex: undefined
		}
		if (match[0][match[0].length - 2] === '/') {
			result.selfClosingTag = true
		} else {
			closingTagRegExp.lastIndex = result.openingTagEndIndex
			match = closingTagRegExp.exec(xml)
			if (match === null) {
				// `xml` is supposed to be "valid XML", so such situation isn't supposed to be possible.
				throw new Error(`Invalid XML: opening tag was found but closing tag was not: </${tagName}>`)
			}
			// Strictly speaking, this closing tag doesn't necessarily correspond to
			// the opening tag found previously. But because a precondition is that
			// `xml` is "valid XML", such erroneous situation isn't supposed to be possible.
			// result.closingTagMarkup = match[0]
			result.closingTagStartIndex = match.index
			result.closingTagEndIndex = match.index + match[0].length - 1
		}
		results.push(result)
		if (stopAfterFirstMatch) {
			break
		}
	}

	return results
}