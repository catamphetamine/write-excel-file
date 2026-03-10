/**
 * Replaces an `element` that was found in `xml` using `findElement()` or `findElements()` function with a given XML `markup`.
 * @param {string} xml
 * @param {FoundElement} element
 * @param {string} markup
 * @returns {string}
 */
export default function replaceElement(xml, element, markup) {
	if (element.selfClosingTag) {
		return xml.slice(0, element.openingTagStartIndex) + markup + xml.slice(element.openingTagEndIndex + 1)
	}
	return xml.slice(0, element.openingTagStartIndex) + markup + xml.slice(element.closingTagEndIndex + 1)
}