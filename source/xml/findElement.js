import findElementsNonRecursive_ from './findElementsNonRecursive_.js'

/**
 * Finds a single element in valid XML markup.
 * @param {string} xml — XML markup
 * @param {string} tagName — The name of the element to find
 * @returns {object|undefined} — A found element, represented by an object with propeties: `{ openingTagStartIndex: number, openingTagEndIndex: number, openingTagAttributes: object, selfClosingTag?: boolean, closingTagStartIndex?: number, closingTagEndIndex?: number }`
 */
export default function findElement(xml, tagName) {
	const elements = findElementsNonRecursive_(xml, { tagName, stopAfterFirstMatch: true })
	return elements[0]
}