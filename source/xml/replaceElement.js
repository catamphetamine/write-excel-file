/**
 * Replaces an `element` that was found in `xml` using `findElement()` function with a given `replacementXml` markup.
 * @param {string} xml
 * @param {FoundElement} element
 * @param {string} replacementXml
 * @returns {string}
 */
export default function replaceElement(xml, element, replacementXml) {
	if (element.selfClosingTag) {
		return xml.slice(0, element.openingTagStartIndex) + replacementXml + xml.slice(element.openingTagEndIndex + 1)
	}
	return xml.slice(0, element.openingTagStartIndex) + replacementXml + xml.slice(element.closingTagEndIndex + 1)
}