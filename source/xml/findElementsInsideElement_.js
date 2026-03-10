import findElements_ from './findElements_.js'
import getMarkupInsideElement from './getMarkupInsideElement.js'

/**
 * Finds either all elements or a single element in valid XML markup within bounds of a given element that was previously found using `findElement()` or `findElements()` function.
 * @param {string} xml — XML markup
 * @param {string} tagName — The name of the element to find
 * @param {object} enclosingElement — An enclosing element that was previously found using `findElement()` or `findElements()` function.
 * @param {boolean} [stopAfterFirstMatch] — Pass `true` to find just one element. Pass `false` or omit to find all elements.
 * @returns {object[]} — A list of found elements, each one represented by an object with propeties: `{ openingTagStartIndex: number, openingTagEndIndex: number, openingTagAttributes: object, selfClosingTag?: boolean, closingTagStartIndex?: number, closingTagEndIndex?: number }`.
 */
export default function findElementsInsideElement_(xml, tagName, enclosingElement, stopAfterFirstMatch) {
	const enclosingElementInnerXml = getMarkupInsideElement(xml, enclosingElement)
	const elements = findElements_(enclosingElementInnerXml, tagName, stopAfterFirstMatch)
	const enclosingElementOffset = enclosingElement.openingTagEndIndex + 1
	for (const element of elements) {
		element.openingTagStartIndex += enclosingElementOffset
		element.openingTagEndIndex += enclosingElementOffset
		if (!element.selfClosingTag) {
			element.closingTagStartIndex += enclosingElementOffset
			element.closingTagEndIndex += enclosingElementOffset
		}
	}
	return elements
}