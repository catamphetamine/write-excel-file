export default function applyEnclosingElementOffset(element, enclosingElement) {
	const enclosingElementOffset = enclosingElement.openingTagEndIndex + 1
	element.openingTagStartIndex += enclosingElementOffset
	element.openingTagEndIndex += enclosingElementOffset
	if (!element.selfClosingTag) {
		element.closingTagStartIndex += enclosingElementOffset
		element.closingTagEndIndex += enclosingElementOffset
	}
}