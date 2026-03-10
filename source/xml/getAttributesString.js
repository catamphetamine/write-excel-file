import escapeAttributeName from './escapeAttributeName.js'
import escapeAttributeValue from './escapeAttributeValue.js'

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
		.map(name => `${escapeAttributeName(name)}="${escapeAttributeValue(String(attributes[name]))}"`)
		.reduce((combined, part) => combined + ' ' + part, '')
}