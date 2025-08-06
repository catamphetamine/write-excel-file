import getImageFileName from '../getImageFileName.js';
export default function generateDrawingXmlRels() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$images = _ref.images,
    images = _ref$images === void 0 ? [] : _ref$images,
    sheetId = _ref.sheetId;
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + images.map(function (image, i) {
    return "<Relationship Id=\"rId".concat(i + 1, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/image\" Target=\"../media/").concat(getImageFileName(image, {
      sheetId: sheetId,
      sheetImages: images
    }), "\"/>");
  }).join('') + '</Relationships>';
}
//# sourceMappingURL=drawing.xml.rels.js.map