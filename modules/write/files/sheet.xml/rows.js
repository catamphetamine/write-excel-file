function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/formatters/rows/generatorRows.js

import generateRow from './row.js';
export default function generateRows(data, _ref) {
  var schema = _ref.schema,
    getHeaderStyle = _ref.getHeaderStyle,
    getStyle = _ref.getStyle,
    getSharedString = _ref.getSharedString,
    customFont = _ref.customFont,
    dateFormat = _ref.dateFormat;
  if (schema) {
    var header = [];
    for (var _iterator = _createForOfIteratorHelperLoose(schema), _step; !(_step = _iterator()).done;) {
      var columnSchema = _step.value;
      // If at least one schema column has a title specified
      // then it means that the header row should be rendered.
      // Otherwise, it wouldn't be rendered.
      if (columnSchema.column) {
        header = [schema.map(function (columnSchema) {
          return _objectSpread({
            type: String,
            value: columnSchema.column,
            align: columnSchema.align
          }, getHeaderStyle ? getHeaderStyle(columnSchema) : DEFAULT_HEADER_STYLE);
        })];
        break;
      }
    }
    data = header.concat(data.map(function (row) {
      return schema.map(function (columnSchema) {
        return _objectSpread(_objectSpread(_objectSpread({}, columnSchema), columnSchema.getCellStyle ? columnSchema.getCellStyle(row) : undefined), {}, {
          value: columnSchema.value(row)
        });
      });
    }));
  }
  return data.map(function (row, index) {
    return generateRow(row, index, {
      getStyle: getStyle,
      getSharedString: getSharedString,
      customFont: customFont,
      dateFormat: dateFormat,
      usesSchema: schema !== undefined
    });
  }).join('');
}
var DEFAULT_HEADER_STYLE = {
  fontWeight: 'bold'
};
//# sourceMappingURL=rows.js.map