export default function getCellStyleProperties(cell) {
	const {
		align,
		alignVertical,
		fontFamily,
		fontSize,
		fontWeight,
		fontStyle,
		wrap,
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
		bottomBorderStyle,
		textRotation
	} = cell

	if (align ||
		alignVertical ||
		fontFamily ||
		fontSize ||
		fontWeight ||
		fontStyle ||
		wrap ||
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
		bottomBorderStyle || 
		textRotation
	) {
		return omitUndefinedProperties({
			align,
			alignVertical,
			fontFamily,
			fontSize,
			fontWeight,
			fontStyle,
			wrap,
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
			bottomBorderStyle,
			textRotation
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