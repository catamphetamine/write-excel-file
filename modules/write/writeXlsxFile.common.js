function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import generateSheetXml from './files/sheet.xml/sheet.xml.js';
import initStyles from './styles.js';
import initSharedStrings from './sharedStrings.js';
import validateSheetName from './validateSheetName.js';
export function generateSheets(_ref) {
  var data = _ref.data,
    sheetName = _ref.sheetName,
    sheetNames = _ref.sheetNames,
    schema = _ref.schema,
    columns = _ref.columns,
    images = _ref.images,
    headerStyle = _ref.headerStyle,
    getHeaderStyle = _ref.getHeaderStyle,
    fontFamily = _ref.fontFamily,
    fontSize = _ref.fontSize,
    orientation = _ref.orientation,
    stickyRowsCount = _ref.stickyRowsCount,
    stickyColumnsCount = _ref.stickyColumnsCount,
    showGridLines = _ref.showGridLines,
    rightToLeft = _ref.rightToLeft,
    dateFormat = _ref.dateFormat;
  var _initSharedStrings = initSharedStrings(),
    getSharedStrings = _initSharedStrings.getSharedStrings,
    getSharedString = _initSharedStrings.getSharedString;
  var _initStyles = initStyles({
      fontFamily: fontFamily,
      fontSize: fontSize
    }),
    getStyles = _initStyles.getStyles,
    getStyle = _initStyles.getStyle;

  // Versions before `1.3.4` had a bug:
  // In a "write multiple sheets" scenario, `columns` parameter
  // wasn't required to be an array of `columns` for each sheet.
  if (sheetNames) {
    if (columns) {
      if (!Array.isArray(columns[0])) {
        throw new Error('In a "write multiple sheets" scenario, `columns` parameter must be an array of `columns` for each sheet.');
      }
    }
  }

  // If only a single sheet is being written,
  // convert parameters to arrays as if multiple sheets were being written.
  // This way, the code after this wouldn't bother about the parameters being arrays or not.
  if (!sheetNames) {
    sheetNames = [sheetName || 'Sheet1'];
    data = [data];
    if (columns) {
      columns = [columns];
    }
    if (schema) {
      schema = [schema];
    }
    if (images) {
      images = [images];
    }
  }

  // Rename deprecated `headerStyle` parameter to `getHeaderStyle(columnSchema)`.
  if (headerStyle && !getHeaderStyle) {
    getHeaderStyle = function getHeaderStyle() {
      return headerStyle;
    };
  }

  // Validate sheet name.
  for (var _iterator = _createForOfIteratorHelperLoose(sheetNames), _step; !(_step = _iterator()).done;) {
    var _sheetName = _step.value;
    validateSheetName(_sheetName);
  }
  var sheetsXml = [];
  var sheetIndex = 0;
  for (var _iterator2 = _createForOfIteratorHelperLoose(sheetNames), _step2; !(_step2 = _iterator2()).done;) {
    var sheet = _step2.value;
    sheetsXml.push(generateSheetXml(data[sheetIndex], {
      schema: schema && schema[sheetIndex],
      columns: columns && columns[sheetIndex],
      images: images && images[sheetIndex],
      getHeaderStyle: getHeaderStyle,
      getStyle: getStyle,
      getSharedString: getSharedString,
      customFont: fontFamily || fontSize,
      dateFormat: dateFormat,
      orientation: orientation,
      stickyRowsCount: stickyRowsCount,
      stickyColumnsCount: stickyColumnsCount,
      showGridLines: showGridLines,
      rightToLeft: rightToLeft,
      sheetId: sheetIndex + 1
    }));
    sheetIndex++;
  }
  return {
    sheets: sheetNames.map(function (sheetName, i) {
      return {
        id: i + 1,
        name: sheetName,
        data: sheetsXml[i],
        images: images && images[i]
      };
    }),
    getSharedStrings: getSharedStrings,
    getStyles: getStyles
  };
}
//# sourceMappingURL=writeXlsxFile.common.js.map