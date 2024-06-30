import sanitizeValue from './sanitizeAttributeValue.js'

export default function getAttributesString(attributes) {
	return Object.keys(attributes)
		.map(name => `${name}="${sanitizeValue(String(attributes[name]))}"`)
		.reduce((combined, part) => combined + ' ' + part, '')
}