import getMarkupInsideElement from './getMarkupInsideElement.js'
import applyEnclosingElementOffset from './applyEnclosingElementOffset.js'
import findElementsNonRecursive_ from './findElementsNonRecursive_.js'

/**
 * Returns all child elements of a given element.
 * @param {string} xml — XML markup
 * @param {object} element — A parent element that was previously found using `findElement()` function.
 * @returns {object[]} — Child elements, each element represented by an object with propeties: `{ openingTagStartIndex: number, openingTagEndIndex: number, openingTagAttributes: object, selfClosingTag?: boolean, closingTagStartIndex?: number, closingTagEndIndex?: number }`
 */
export default function getChildElements(xml, element) {
	const children = findElementsNonRecursive_(getMarkupInsideElement(xml, element))
	for (const child of children) {
		applyEnclosingElementOffset(child, element)
	}
	return children
}