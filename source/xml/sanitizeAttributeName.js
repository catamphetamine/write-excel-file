import removeInvalidXmlCharacters from './removeInvalidXmlCharacters.js'

/**
 * Removes invalid characters and escapes "speciaL" characters in an XML attribute's name.
 * @param {string} attributeName
 * @returns {string}
 */
export default function sanitizeAttributeName(attributeName) {
	if (typeof attributeName !== 'string') {
		throw new TypeError('Argument must be a string')
	}
	// Remove characters that're invalid in XML.
	attributeName = removeInvalidXmlCharacters(attributeName)
	// Remove characters that're invalid in an XML attribute name.
	return attributeName
		.replace(/[^a-zA-Z_0-9-.:]/g, '')
		.replace(/^[^a-zA-Z_]+/, '')
}