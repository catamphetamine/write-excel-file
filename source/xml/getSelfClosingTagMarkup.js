import getOpeningTagMarkup from './getOpeningTagMarkup.js'

/**
 * Returns XML markup for an element with a given `tagName`, optional `attributes` and no child elements.
 * @param {string} tagName
 * @param {object} [attributes]
 * @returns {string}
 */
export default function getSelfClosingTagMarkup(tagName, attributes) {
	return getOpeningTagMarkup(tagName, attributes).slice(0, -1) + '/>'
}