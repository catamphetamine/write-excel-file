import findElementsInsideElement_ from './findElementsInsideElement_.js'

/**
 * Finds all elements in valid XML markup within bounds of a given element that was previously found using `findElement()` or `findElements()` function.
 * @param {string} xml — XML markup
 * @param {string} tagName — The name of the element to find
 * @param {object} enclosingElement — An enclosing element that was previously found using `findElement()` or `findElements()` function.
 * @returns {object[]} — A list of found elements, each one represented by an object with propeties: `{ openingTagStartIndex: number, openingTagEndIndex: number, openingTagAttributes: object, selfClosingTag?: boolean, closingTagStartIndex?: number, closingTagEndIndex?: number }`
 */
export default function findElementsInsideElement(xml, tagName, enclosingElement) {
	return findElementsInsideElement_(xml, tagName, enclosingElement)
}