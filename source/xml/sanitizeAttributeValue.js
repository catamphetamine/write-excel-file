import escapeXmlSpecialCharacters from './escapeXmlSpecialCharacters.js'
import removeInvalidXmlCharacters from './removeInvalidXmlCharacters.js'

/**
 * Removes invalid characters and escapes "speciaL" characters in an XML attribute's value.
 * @param {string} attributeValue
 * @returns {string}
 */
export default function sanitizeAttributeValue(attributeValue) {
	if (typeof attributeValue !== 'string') {
		throw new TypeError('Argument must be a string')
	}
	// Remove characters that're invalid in XML.
	attributeValue = removeInvalidXmlCharacters(attributeValue)
	// Escape "special" characters.
	return escapeXmlSpecialCharacters(attributeValue, { isAttributeValue: true })
}