function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import $text from '../../xml/sanitizeText.js';
export default function generateSharedStringsXml(sharedStrings) {
  var xml = '<?xml version="1.0"?>';
  xml += '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
  for (var _iterator = _createForOfIteratorHelperLoose(sharedStrings), _step; !(_step = _iterator()).done;) {
    var string = _step.value;
    var attributes = string.trim().length === string.length ? '' : ' xml:space="preserve"';
    xml += "<si><t".concat(attributes, ">");
    xml += $text(string);
    xml += '</t></si>';
  }
  xml += '</sst>';
  return xml;
}
//# sourceMappingURL=sharedStrings.xml.js.map