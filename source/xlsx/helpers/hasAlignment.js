export default function hasAlignment({
	align,
	alignVertical,
	textRotation,
	indent,
	wrap
}) {
	return Boolean(
		align ||
		alignVertical ||
		typeof textRotation === 'number' ||
		indent ||
		wrap
	)
}