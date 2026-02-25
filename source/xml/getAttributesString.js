import sanitizeAttributeValue from './sanitizeAttributeValue.js'

export default function getAttributesString(attributes) {
	return Object.keys(attributes)
		.map(name => `${name}="${sanitizeAttributeValue(String(attributes[name]))}"`)
		.reduce((combined, part) => combined + ' ' + part, '')
}