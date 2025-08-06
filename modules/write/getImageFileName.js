import getFileExtensionForContentType from './getFileExtensionForContentType.js';

//
export default function getImageFileName(image, _ref) {
  var sheetId = _ref.sheetId,
    sheetImages = _ref.sheetImages;
  return "sheet".concat(sheetId, "-image").concat(sheetImages.indexOf(image) + 1, ".").concat(getFileExtensionForContentType(image.contentType));
}
//# sourceMappingURL=getImageFileName.js.map