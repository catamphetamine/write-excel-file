/**
 * Returns the XML inside an `element` that was found in `xml` using `findElement()` function.
 * @param {string} xml
 * @param {FoundElement} element
 * @returns {string}
 */
export default function getMarkupInsideElement(xml, element) {
	if (element.selfClosingTag) {
		return ''
	}
	return xml.substring(element.openingTagEndIndex + 1, element.closingTagStartIndex)
}