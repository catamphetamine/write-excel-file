import addProperties from '../../../helpers/features/addProperties.js'

import hasAlignment from '../../../helpers/hasAlignment.js'
import hasFont from '../../../helpers/hasFont.js'
import hasFill from '../../../helpers/hasFill.js'

export default function getCellStyleProperties(cell, features) {
	const {
		align,
		alignVertical,
		textRotation,
		indent,
		wrap,
		fontFamily,
		fontSize,
		fontWeight,
		fontStyle,
		textDecoration,
		textColor,
		backgroundColor,
		fillPatternStyle,
		fillPatternColor,
		borderColor,
		borderStyle,
		leftBorderColor,
		leftBorderStyle,
		rightBorderColor,
		rightBorderStyle,
		topBorderColor,
		topBorderStyle,
		bottomBorderColor,
		bottomBorderStyle
	} = cell

	// Add any custom cell style properties that're used by plugins.
	const additionalProperties = {}
	addProperties(additionalProperties, cell, features, 'style')

	if (
		hasAlignment({
			align,
			alignVertical,
			textRotation,
			indent,
			wrap
		}) ||
		hasFont({
			fontFamily,
			fontSize,
			fontWeight,
			fontStyle,
			textDecoration,
			textColor
		}) ||
		hasFill({
			backgroundColor,
			fillPatternStyle,
			fillPatternColor,
			borderColor,
			borderStyle,
			leftBorderColor,
			leftBorderStyle,
			rightBorderColor,
			rightBorderStyle,
			topBorderColor,
			topBorderStyle,
			bottomBorderColor,
			bottomBorderStyle
		}) ||
		Object.keys(additionalProperties).length > 0
	) {
		return omitUndefinedProperties({
			...additionalProperties,
			align,
			alignVertical,
			textRotation,
			indent,
			wrap,
			fontFamily,
			fontSize,
			fontWeight,
			fontStyle,
			textDecoration,
			textColor,
			backgroundColor,
			borderColor,
			borderStyle,
			leftBorderColor,
			leftBorderStyle,
			rightBorderColor,
			rightBorderStyle,
			topBorderColor,
			topBorderStyle,
			bottomBorderColor,
			bottomBorderStyle
		})
	}
}

function omitUndefinedProperties(object) {
	const filteredObject = {}

	for (const key in object) {
		if (object[key] !== undefined) {
			filteredObject[key] = object[key]
		}
	}

	return filteredObject
}