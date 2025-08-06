function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import $attr from '../../xml/sanitizeAttributeValue.js';

// https://gitlab.com/catamphetamine/write-excel-file/-/blob/main/docs/IMAGES.md
export default function generateDrawingXml(_ref) {
  var images = _ref.images;
  var output = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + '<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">';
  var i = 0;
  var _loop = function _loop() {
    var image = _step.value;
    // The `rId` of the image in `drawing.xml.rels` file.
    var imageId = i + 1;
    var pxToEmu = function pxToEmu(px) {
      return pxToEmu_(px, image.dpi);
    };

    // There're two ways an image could be "anchored" in a spreadsheet:
    // * One-cell anchor — "anchors" the image's top-left corner to a top-left corner of a cell.
    // * Two-cell anchor — "anchors" the image's top-left corner to a top-left corner of the first cell,
    //   and then the image's bottom-right corner to the bottom-right corner of the second cell.
    //   While doing so, it completely ignores the image's aspect ratio, so there seems to be
    //   no equivalent for CSS's `object-fit: contain` behavior.
    output += '<xdr:oneCellAnchor>';
    output += '<xdr:from>';
    output += "<xdr:col>".concat(image.anchor.column - 1, "</xdr:col>");
    output += "<xdr:colOff>".concat(typeof image.offsetX === 'number' ? pxToEmu(image.offsetX) : 0, "</xdr:colOff>");
    output += "<xdr:row>".concat(image.anchor.row - 1, "</xdr:row>");
    output += "<xdr:rowOff>".concat(typeof image.offsetY === 'number' ? pxToEmu(image.offsetY) : 0, "</xdr:rowOff>");
    output += '</xdr:from>';
    output += "<xdr:ext cx=\"".concat(pxToEmu(image.width), "\" cy=\"").concat(pxToEmu(image.height), "\"/>");
    output += '<xdr:pic>';
    output += '<xdr:nvPicPr>';
    output += "<xdr:cNvPr id=\"".concat(imageId, "\" name=\"").concat(image.title ? $attr(image.title) : 'Picture ' + imageId, "\" descr=\"").concat(image.description ? $attr(image.description) : '', "\"/>");
    output += '<xdr:cNvPicPr>';
    // Optional XML element. Locks the aspect ratio of the image. -->
    output += '<a:picLocks noChangeAspect="1"/>';
    output += '</xdr:cNvPicPr>';
    output += '</xdr:nvPicPr>';
    output += '<xdr:blipFill>';

    // The link to the image.
    output += "<a:blip xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" r:embed=\"rId".concat(imageId, "\" cstate=\"print\"/>");

    // Allows scaling the image.
    output += '<a:stretch>';
    output += '<a:fillRect/>';
    output += '</a:stretch>';
    output += '</xdr:blipFill>';

    // Dunno what this is.
    output += '<xdr:spPr>';
    output += '<a:prstGeom prst="rect">';
    output += '<a:avLst/>';
    output += '</a:prstGeom>';
    output += '</xdr:spPr>';
    output += '</xdr:pic>';
    output += '<xdr:clientData/>';
    output += '</xdr:oneCellAnchor>';
    i++;
  };
  for (var _iterator = _createForOfIteratorHelperLoose(images), _step; !(_step = _iterator()).done;) {
    _loop();
  }
  output += '</xdr:wsDr>';
  return output;
}

// For legacy reasons, XLSX documents measure image dimensions not in pixels
// but rather in a weird measurement unit called EMU (English Metric Unit).
// https://gitlab.com/catamphetamine/write-excel-file/-/blob/main/docs/IMAGES.md#image-dimensions
// This function converts pixels to EMUs.
var DEFAULT_DISPLAY_DPI = 96;
var DEFAULT_IMAGE_DPI = 96;
function pxToEmu_(px, imageDpi) {
  var displayDpi = DEFAULT_DISPLAY_DPI;
  return Math.round(px * 9525 * (DEFAULT_DISPLAY_DPI / displayDpi) * (DEFAULT_IMAGE_DPI / imageDpi));
}
//# sourceMappingURL=drawing.xml.js.map