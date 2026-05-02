import sanitizeAttributeName from './sanitizeAttributeName.js'
import sanitizeAttributeValue from './sanitizeAttributeValue.js'

/**
 * Converts an object with XML attribute values to a string.
 * Examples:
 * { a: 'b', c: 'd' } → ' a="b" c="d"'
 * {} → ''
 * @param {object} attributes
 * @returns {string}
 */
export default function getAttributesString(attributes) {
	return Object.keys(attributes)
		.map(name => `${sanitizeAttributeName(name)}="${sanitizeAttributeValue(String(attributes[name]))}"`)
		.reduce((combined, part) => combined + ' ' + part, '')
}