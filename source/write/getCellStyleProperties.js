export default function getCellStyleProperties(cell) {
	const {
		align,
		alignVertical,
		textRotation,
		wrap,
		fontFamily,
		fontSize,
		fontWeight,
		fontStyle,
		color,
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
	} = cell

	if (align ||
		alignVertical ||
		textRotation ||
		wrap ||
		fontFamily ||
		fontSize ||
		fontWeight ||
		fontStyle ||
		color ||
		backgroundColor ||
		borderColor ||
		borderStyle ||
		leftBorderColor ||
		leftBorderStyle ||
		rightBorderColor ||
		rightBorderStyle ||
		topBorderColor ||
		topBorderStyle ||
		bottomBorderColor ||
		bottomBorderStyle
	) {
		return omitUndefinedProperties({
			align,
			alignVertical,
			textRotation,
			wrap,
			fontFamily,
			fontSize,
			fontWeight,
			fontStyle,
			color,
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