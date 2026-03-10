import findElements_ from './findElements_.js'

/**
 * Finds all elements in valid XML markup.
 * @param {string} xml — XML markup
 * @param {string} tagName — The name of the element to find
 * @returns {object[]} — A list of found elements, each one represented by an object with propeties: `{ openingTagStartIndex: number, openingTagEndIndex: number, openingTagAttributes: object, selfClosingTag?: boolean, closingTagStartIndex?: number, closingTagEndIndex?: number }`
 */
export default function findElements(xml, tagName) {
	return findElements_(xml, tagName)
}