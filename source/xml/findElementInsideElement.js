import findElementsInsideElement_ from './findElementsInsideElement_.js'

/**
 * Finds a single element in valid XML markup within bounds of a given element that was previously found using `findElement()` or `findElements()` function.
 * @param {string} xml — XML markup
 * @param {string} tagName — The name of the element to find
 * @param {object} enclosingElement — An enclosing element that was previously found using `findElement()` or `findElements()` function.
 * @returns {object|undefined} — A found element, represented by an object with propeties: `{ openingTagStartIndex: number, openingTagEndIndex: number, openingTagAttributes: object, selfClosingTag?: boolean, closingTagStartIndex?: number, closingTagEndIndex?: number }`
 */
export default function findElementInsideElement(xml, tagName, enclosingElement) {
	return findElementsInsideElement_(xml, tagName, enclosingElement, true)[0]
}