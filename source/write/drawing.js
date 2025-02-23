export default function generateDrawing({ images }) {
	if (images) {
		// Each sheet has at most one "drawing", so the drawing ID is always `1`.
		return '<drawing r:id="rId1"/>'
	}
	return ''
}