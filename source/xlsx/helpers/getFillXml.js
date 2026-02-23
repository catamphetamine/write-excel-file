import $attributeValue from '../../xml/sanitizeAttributeValue.js'
import getXlsxColorForHexColor from './getXlsxColorForHexColor.js'

import hasFill from './hasFill.js'

export default function getFillXml(fill, {} = {}) {
	const {
		backgroundColor,
		fillPatternStyle,
		fillPatternColor
	} = fill

	const isSolidFill = !fillPatternStyle || fillPatternStyle === 'solid'

	if (!hasFill(fill)) {
		return '<fill>' + '<patternFill patternType="none"/>' + '</fill>'
	}

	let xml = '<fill>'

	// In XLSX, a background could be one of two types:
	//
	// * Some background color
	//   * `<patternFill patternType="solid"/>`
	//   * `<fgColor rgb="..."/>` — extremely weirdly, "background color" is specified as "foreground color" in XLSX standard.
	//   * `<bgColor indexed="64"/>` — just ignore this extremely weird mandatory element in XLSX standard.
	// * Some background color + Some pattern over it
	//   * `<patternFill patternType="...something-other-than-solid..."/>`
	//   * `<fgColor rgb="..."/>` — Pattern color
	//   * `<bgColor rgb="..."/>` — Background color

	xml += `<patternFill patternType="${isSolidFill ? 'solid' : fillPatternStyle}">`
	xml += `<fgColor rgb="${$attributeValue(getXlsxColorForHexColor(isSolidFill ? backgroundColor : fillPatternColor))}"/>`
	xml += `<bgColor ${isSolidFill ? 'indexed="64"' : 'rgb="' + $attributeValue(getXlsxColorForHexColor(backgroundColor)) + '"'}/>`
	xml += '</patternFill>'

	// Close the `<fill>` element.
	xml += '</fill>'

	// Return the XML.
	return xml
}