export default function hasBorder({
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
}) {
	return Boolean(
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
	)
}