import escapeXmlSpecialCharacters from './escapeXmlSpecialCharacters.js'
import removeInvalidXmlCharacters from './removeInvalidXmlCharacters.js'

/**
 * Escapes invalid characters in an XML attribute value.
 * @param {string} attributeValue
 * @returns {string}
 */
export default function escapeAttributeValue(attributeValue) {
	if (typeof attributeValue !== 'string') {
		throw new TypeError('Argument must be a string')
	}
	return escapeXmlSpecialCharacters(removeInvalidXmlCharacters(attributeValue), { isAttributeValue: true })
}