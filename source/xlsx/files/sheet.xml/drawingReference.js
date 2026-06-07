export default function generateDrawingReference(tag) {
	// Each sheet has at most one "drawing", so the drawing ID is always `1`.
	// Here it always creates a drawing, even if it's going to be empty.
	// Such behavior is more convenient for "features" (plugins)
	// that might rely on a drawing to already exist.
	// For example, images "feature" uses this drawing.
	return tag('drawing', { 'r:id': 'rId-drawing-1' })
}

export const UNUSED_DRAWING_REFERENCE_XML = '<drawing r:id="rId-drawing-1"/>'