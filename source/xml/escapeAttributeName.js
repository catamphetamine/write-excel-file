import escapeXmlSpecialCharacters from './escapeXmlSpecialCharacters.js'
import removeInvalidXmlCharacters from './removeInvalidXmlCharacters.js'

/**
 * Escapes invalid characters in an XML attribute name.
 * @param {string} attributeName
 * @returns {string}
 */
export default function escapeAttributeName(attributeName) {
	if (typeof attributeName !== 'string') {
		throw new TypeError('Argument must be a string')
	}
	return escapeXmlSpecialCharacters(removeInvalidXmlCharacters(attributeName), { isAttributeValue: false })
}