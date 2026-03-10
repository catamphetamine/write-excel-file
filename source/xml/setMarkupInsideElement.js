/**
 * Sets the XML markup inside an `element` that was found in `xml` using `findElement()` or `findElements()` function.
 * @param {string} xml
 * @param {FoundElement} element
 * @param {string} [markup]
 * @returns {string}
 */
export default function setMarkupInsideElement(xml, element, markup) {
	if (markup) {
		if (element.selfClosingTag) {
			return xml.slice(0, element.openingTagEndIndex - '/'.length) + '>' + markup + '</' + element.tagName + '>' + xml.slice(element.openingTagEndIndex + 1)
		}
		return xml.slice(0, element.openingTagEndIndex + 1) + markup + xml.slice(element.closingTagStartIndex)
	} else {
		if (element.selfClosingTag) {
			return xml
		}
		return xml.slice(0, element.openingTagEndIndex) + '/>' + xml.slice(element.closingTagEndIndex + 1)
	}
}