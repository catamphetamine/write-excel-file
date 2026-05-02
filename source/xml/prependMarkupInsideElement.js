import setMarkupInsideElement from './setMarkupInsideElement.js'

/**
 * Prepends XML inside an `element` that was found in `xml` using `findElement()` function.
 * @param {string} xml
 * @param {FoundElement} element
 * @param {string} addedXml
 * @returns {string}
 */
export default function prependMarkupInsideElement(xml, element, addedXml) {
	if (element.selfClosingTag) {
		return setMarkupInsideElement(xml, element, addedXml)
	}
	return xml.slice(0, element.openingTagEndIndex + 1) + addedXml + xml.slice(element.openingTagEndIndex + 1)
}