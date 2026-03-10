import setMarkupInsideElement from './setMarkupInsideElement.js'

/**
 * Prepends `markup` inside an `element` that was found in `xml` using `findElement()` or `findElements()` function.
 * @param {string} xml
 * @param {FoundElement} element
 * @param {string} markup
 * @returns {string}
 */
export default function prependMarkupInsideElement(xml, element, markup) {
	if (element.selfClosingTag) {
		return setMarkupInsideElement(xml, element, markup)
	}
	return xml.slice(0, element.openingTagEndIndex + 1) + markup + xml.slice(element.openingTagEndIndex + 1)
}