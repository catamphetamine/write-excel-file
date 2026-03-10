import escapeXmlSpecialCharacters from './escapeXmlSpecialCharacters.js'
import removeInvalidXmlCharacters from './removeInvalidXmlCharacters.js'

/**
 * Escapes invalid characters in an XML element's text content.
 * @param {string} textContent
 * @returns {string}
 */
export default function escapeTextContent(textContent) {
	if (typeof textContent !== 'string') {
		throw new TypeError('Argument must be a string')
	}
	return escapeXmlSpecialCharacters(removeInvalidXmlCharacters(textContent), { isAttributeValue: false })
}