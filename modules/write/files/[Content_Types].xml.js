function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import getFileExtensionForContentType from '../getFileExtensionForContentType.js';

// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/statics/%5BContent_Types%5D.xml.js

export default function generateContentTypesXml(_ref) {
  var images = _ref.images,
    sheets = _ref.sheets;
  return '<?xml version="1.0" ?>' + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' + '<Default ContentType="application/xml" Extension="xml"/>' + '<Default ContentType="application/vnd.openxmlformats-package.relationships+xml" Extension="rels"/>' + sheets.map(function (_ref2) {
    var id = _ref2.id;
    return "<Override ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\" PartName=\"/xl/worksheets/sheet".concat(id, ".xml\"/>");
  }).join('') + sheets.map(function (_ref3) {
    var id = _ref3.id,
      images = _ref3.images;
    return images ? "<Override ContentType=\"application/vnd.openxmlformats-officedocument.drawing+xml\" PartName=\"/xl/drawings/drawing".concat(id, ".xml\"/>") : '';
  }).join('') + '<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" PartName="/xl/workbook.xml"/>' + '<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml" PartName="/xl/sharedStrings.xml"/>' + '<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" PartName="/xl/styles.xml"/>' + getFileExtensionContentTypes(images).map(function (_ref4) {
    var fileExtension = _ref4.fileExtension,
      contentType = _ref4.contentType;
    return "<Default Extension=\"".concat(fileExtension, "\" ContentType=\"").concat(contentType, "\"/>");
  }).join('') + '</Types>';
}
function getFileExtensionContentTypes(images) {
  if (!images) {
    return [];
  }
  var fileExtensionContentTypes = [];
  var addFileExtensionContentType = function addFileExtensionContentType(image) {
    var fileExtension = getFileExtensionForContentType(image.contentType);
    var existingFileExtensionContentType = fileExtensionContentTypes.find(function (_) {
      return _.fileExtension === fileExtension;
    });
    if (!existingFileExtensionContentType) {
      fileExtensionContentTypes.push({
        fileExtension: fileExtension,
        contentType: image.contentType
      });
    }
  };
  if (Array.isArray(images[0])) {
    for (var _iterator = _createForOfIteratorHelperLoose(images), _step; !(_step = _iterator()).done;) {
      var sheetImages = _step.value;
      for (var _iterator2 = _createForOfIteratorHelperLoose(sheetImages), _step2; !(_step2 = _iterator2()).done;) {
        var image = _step2.value;
        addFileExtensionContentType(image);
      }
    }
  } else {
    for (var _iterator3 = _createForOfIteratorHelperLoose(images), _step3; !(_step3 = _iterator3()).done;) {
      var _image = _step3.value;
      addFileExtensionContentType(_image);
    }
  }
  return fileExtensionContentTypes;
}
//# sourceMappingURL=[Content_Types].xml.js.map