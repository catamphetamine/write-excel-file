import escapeXmlSpecialCharacters from './escapeXmlSpecialCharacters.js'
import removeInvalidXmlCharacters from './removeInvalidXmlCharacters.js'

/**
 * Removes invalid characters and escapes "speciaL" characters in an XML element's text content.
 * @param {string} textContent
 * @returns {string}
 */
export default function sanitizeTextContent(textContent) {
	if (typeof textContent !== 'string') {
		throw new TypeError('Argument must be a string')
	}
	// Remove characters that're invalid in XML.
	textContent = removeInvalidXmlCharacters(textContent)
	// Escape "special" characters.
	return escapeXmlSpecialCharacters(textContent, { isAttributeValue: false })
}