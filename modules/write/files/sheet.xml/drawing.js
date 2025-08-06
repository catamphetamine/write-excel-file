export default function generateDrawing(_ref) {
  var images = _ref.images;
  if (images) {
    // Each sheet has at most one "drawing", so the drawing ID is always `1`.
    return '<drawing r:id="rId1"/>';
  }
  return '';
}
//# sourceMappingURL=drawing.js.map