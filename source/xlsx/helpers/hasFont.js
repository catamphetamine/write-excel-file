export default function hasFont({
	fontFamily,
	fontSize,
	fontWeight,
	fontStyle,
	textDecoration,
	textColor
}) {
	return Boolean(
		fontFamily ||
		typeof fontSize === 'number' ||
		fontWeight ||
		fontStyle ||
		(textDecoration && Object.keys(textDecoration).length > 0) ||
		textColor
	)
}