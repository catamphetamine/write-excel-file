/**
 * Replaces the XML inside an `element` that was found in `xml` using `findElement()` function.
 * @param {string} xml
 * @param {FoundElement} element
 * @param {string} [replacementXml]
 * @returns {string}
 */
export default function setMarkupInsideElement(xml, element, replacementXml) {
	if (replacementXml) {
		if (element.selfClosingTag) {
			return xml.slice(0, element.openingTagEndIndex - '/'.length) + '>' + replacementXml + '</' + element.tagName + '>' + xml.slice(element.openingTagEndIndex + 1)
		}
		return xml.slice(0, element.openingTagEndIndex + 1) + replacementXml + xml.slice(element.closingTagStartIndex)
	} else {
		if (element.selfClosingTag) {
			return xml
		}
		return xml.slice(0, element.openingTagEndIndex) + '/>' + xml.slice(element.closingTagEndIndex + 1)
	}
}