/**
 * Returns XML markup for a "closing tag" with a given `tagName`.
 * @param {string} tagName
 * @returns {string}
 */
export default function getClosingTagMarkup(tagName) {
	return '</' + tagName + '>'
}