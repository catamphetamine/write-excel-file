import getAttributesString from './getAttributesString.js'

/**
 * Returns XML markup for an "opening tag" with a given `tagName` and optional `attributes`.
 * @param {string} tagName
 * @param {object} [attributes]
 * @returns {string}
 */
export default function getOpeningTagMarkup(tagName, attributes) {
	return '<' + tagName + (attributes ? getAttributesString(attributes) : '') + '>'
}