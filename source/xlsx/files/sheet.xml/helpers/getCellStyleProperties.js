import hasAlignment from '../../../helpers/hasAlignment.js'
import hasBorder from '../../../helpers/hasBorder.js'
import hasFill from '../../../helpers/hasFill.js'
import hasFont from '../../../helpers/hasFont.js'

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
			fillPatternColor
		}) ||
		hasBorder({
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
	) {
		return omitUndefinedProperties({
			// alignment
			align,
			alignVertical,
			textRotation,
			indent,
			wrap,
			// font
			fontFamily,
			fontSize,
			fontWeight,
			fontStyle,
			textDecoration,
			textColor,
			// fill
			backgroundColor,
			fillPatternStyle,
			fillPatternColor,
			// border
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