export default function hasFill({
	backgroundColor,
	fillPatternStyle,
	fillPatternColor
}) {
	return Boolean(backgroundColor || (fillPatternStyle && fillPatternColor))
}