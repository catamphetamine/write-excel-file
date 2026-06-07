import getOpeningTagMarkup from '../../../xml/getOpeningTagMarkup.js'
import getClosingTagMarkup from '../../../xml/getClosingTagMarkup.js'
import getSelfClosingTagMarkup from '../../../xml/getSelfClosingTagMarkup.js'

export default function getElementXml(
	fileName,
	tagName,
	attributes, // Could be `undefined` or `null`
	innerXml, // Could be `undefined` or `null`
	index, // Could be `undefined`
	properties,
	sheetOptionsOrSheetsOptions,
	features
) {
	for (const feature of features) {
		const transform = feature.files && feature.files.transform && feature.files.transform[fileName]
		if (transform && transform.transformElementAttributes) {
			attributes = transform.transformElementAttributes(
				tagName,
				attributes || NO_ATTRIBUTES,
				index,
				sheetOptionsOrSheetsOptions,
				properties
			)
		}
	}

	if (innerXml) {
		return getOpeningTagMarkup(tagName, attributes) + innerXml + getClosingTagMarkup(tagName)
	} else {
		return getSelfClosingTagMarkup(tagName, attributes)
	}
}

const NO_ATTRIBUTES = {}