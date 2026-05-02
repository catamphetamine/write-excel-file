import setMarkupInsideElement from './setMarkupInsideElement.js'

/**
 * Appends XML inside an `element` that was found in `xml` using `findElement()` function.
 * @param {string} xml
 * @param {FoundElement} element
 * @param {string} addedXml
 * @returns {string}
 */
export default function appendMarkupInsideElement(xml, element, addedXml) {
	if (element.selfClosingTag) {
		return setMarkupInsideElement(xml, element, addedXml)
	}
	return xml.slice(0, element.closingTagStartIndex) + addedXml + xml.slice(element.closingTagStartIndex)
}