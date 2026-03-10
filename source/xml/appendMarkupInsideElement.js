import setMarkupInsideElement from './setMarkupInsideElement.js'

/**
 * Appends `markup` inside an `element` that was found in `xml` using `findElement()` or `findElements()` function.
 * @param {string} xml
 * @param {FoundElement} element
 * @param {string} markup
 * @returns {string}
 */
export default function appendMarkupInsideElement(xml, element, markup) {
	if (element.selfClosingTag) {
		return setMarkupInsideElement(xml, element, markup)
	}
	return xml.slice(0, element.closingTagStartIndex) + markup + xml.slice(element.closingTagStartIndex)
}