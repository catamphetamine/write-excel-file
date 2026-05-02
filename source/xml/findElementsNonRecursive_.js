/**
 * Finds elements in valid XML markup.
 * Caveat: Every time it finds an element, it doesn't "step into" it but rather "steps over" it.
 * @param {string} xml — XML markup
 * @param {string} [options.tagName] — The name of the element to find
 * @param {boolean} [options.stopAfterFirstMatch] — If `true`, will only return a single result.
 * @returns {object[]} — Found elements, each element represented by an object with propeties: `{ openingTagStartIndex: number, openingTagEndIndex: number, openingTagAttributes: object, selfClosingTag?: boolean, closingTagStartIndex?: number, closingTagEndIndex?: number }`
 */
export default function findElementsNonRecursive_(xml, { tagName, stopAfterFirstMatch } = {}) {
	const openingTagRegExp = new RegExp(
		getOpeningTagRegExpPattern(tagName),
		stopAfterFirstMatch ? undefined :  'g'
	)

	const results = []

	let openingTagMatch
	while ((openingTagMatch = openingTagRegExp.exec(xml)) !== null) {
		const openingTag = openingTagMatch[0]
		const openingTagName = tagName || openingTagMatch[1]

		const attributes = {}
		const attributeRegExp = new RegExp('\\s+([^\\s=>]+)(?:="([^\\s=>]+)")', 'g')
		let attributeMatch
		while ((attributeMatch = attributeRegExp.exec(openingTag)) !== null) {
			attributes[attributeMatch[1]] = attributeMatch[2]
		}

		const result = {
			tagName: openingTagName,
			// openingTagMarkup: openingTag,
			openingTagStartIndex: openingTagMatch.index,
			openingTagEndIndex: openingTagMatch.index + openingTag.length - 1,
			openingTagAttributes: attributes,
			selfClosingTag: false,
			// closingTagMarkup: undefined,
			closingTagStartIndex: undefined,
			closingTagEndIndex: undefined
		}

		if (openingTag[openingTag.length - 2] === '/') {
			result.selfClosingTag = true
		} else {
			const closingTagPosition = findClosingTagPosition(xml, result.openingTagEndIndex + 1, openingTagName)
			if (!closingTagPosition) {
				// `xml` is supposed to be "valid XML", so such situation isn't supposed to be possible.
				throw new Error(`Invalid XML: opening tag was found but closing tag was not: </${openingTagName}>`)
			}
			result.closingTagStartIndex = closingTagPosition[0]
			result.closingTagEndIndex = closingTagPosition[1]
		}

		results.push(result)

		if (stopAfterFirstMatch) {
			break
		}

		// Set "start from" index of the next match.
		if (result.selfClosingTag) {
			openingTagRegExp.lastIndex = result.openingTagEndIndex + 1
		} else {
			openingTagRegExp.lastIndex = result.closingTagEndIndex + 1
		}
	}

	return results
}

function findClosingTagPosition(xml, startFromIndex, tagName) {
	const openingOrClosingTagRegExp = new RegExp('<(/)?' + tagName + '(?:\\s+[^>]+|/)?>', 'g')
	openingOrClosingTagRegExp.lastIndex = startFromIndex

	let nestingLevel = 0
	let openingOrClosingTagMatch
	while ((openingOrClosingTagMatch = openingOrClosingTagRegExp.exec(xml)) !== null) {
		const openingOrClosingTag = openingOrClosingTagMatch[0]
		// Tells if it's a closing tag or an opening tag.
		const closingTagMarker = openingOrClosingTagMatch[1]
		if (closingTagMarker) {
			// Closing tag encountered.
			if (nestingLevel > 0) {
				nestingLevel--
			} else {
				return [
					openingOrClosingTagMatch.index,
					openingOrClosingTagMatch.index + openingOrClosingTag.length - 1
				]
			}
		} else {
			// Opening tag encountered.
			nestingLevel++
		}
	}
}

export function getOpeningTagRegExpPattern(tagName) {
	return '<' + (tagName || '([^\\s/>]+)') + '(?:\\s+[^>]+|/)?>'
}