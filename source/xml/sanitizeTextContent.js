import escapeXmlCharacters from './escapeXmlCharacters.js'
import removeInvalidXmlCharacters from './removeInvalidXmlCharacters.js'

export default function sanitizeTextContent(string) {
	if (typeof string !== 'string') {
		throw new TypeError('Argument must be a string')
	}
	return escapeXmlCharacters(removeInvalidXmlCharacters(string), { attribute: false })
}