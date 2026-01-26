function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import $attr from '../../xml/sanitizeAttributeValue.js';
import { FORMAT_ID_STARTS_FROM } from '../styles.js';
export default function generateStylesXml(_ref) {
  var formats = _ref.formats,
    styles = _ref.styles,
    conditionalStyles = _ref.conditionalStyles,
    fonts = _ref.fonts,
    fills = _ref.fills,
    borders = _ref.borders;
  var xml = '<?xml version="1.0" ?>';
  xml += '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';

  // Turns out, as weird as it sounds, the order of XML elements matters to MS Office Excel.
  // https://social.msdn.microsoft.com/Forums/office/en-US/cc47ab65-dab7-4e32-b676-b641aa1e1411/how-to-validate-the-xlsx-that-i-generate?forum=oxmlsdk
  // For example, previously this library was inserting `<cellXfs/>` before `<fonts/>`
  // and that caused MS Office 2007 Excel to throw an error about the file being corrupt:
  // "Excel found unreadable content in '*.xlsx'. Do you want to recover the contents of this workbook?"
  // "Excel was able to open the file by repairing or removing the unreadable content."
  // "Removed Part: /xl/styles.xml part with XML error.  (Styles) Load error. Line 1, column ..."
  // "Repaired Records: Cell information from /xl/worksheets/sheet1.xml part"

  if (formats.length > 0) {
    xml += "<numFmts count=\"".concat(formats.length, "\">");
    for (var i = 0; i < formats.length; i++) {
      xml += "<numFmt numFmtId=\"".concat(FORMAT_ID_STARTS_FROM + i, "\" formatCode=\"").concat($attr(formats[i]), "\"/>");
    }
    xml += "</numFmts>";
  }
  xml += "<fonts count=\"".concat(fonts.length, "\">");
  for (var _iterator = _createForOfIteratorHelperLoose(fonts), _step; !(_step = _iterator()).done;) {
    var font = _step.value;
    var size = font.size,
      family = font.family,
      color = font.color,
      weight = font.weight,
      style = font.style,
      custom = font.custom;
    xml += '<font>';
    xml += "<sz val=\"".concat(size, "\"/>");
    xml += "<color ".concat(color ? 'rgb="' + $attr(getColor(color)) + '"' : 'theme="1"', "/>");
    xml += "<name val=\"".concat($attr(family), "\"/>");
    // It's not clear what the `<family/>` tag means or does.
    // It seems to always be `<family val="2"/>` even for different
    // font families (Calibri, Arial, etc).
    xml += '<family val="2"/>';
    //
    // It's not clear what the `<scheme/>` tag means or does.
    // Seems like it's only preset for the default "Calibri" font.
    // Adding it to any other font resets the font family in Microsoft Excel 2007.
    //
    // "Defines the font scheme, if any, to which this font belongs.
    //  When a font definition is part of a theme definition, then the font
    //  is categorized as either a "major" or "minor" font scheme component.
    //  When a new theme is chosen, every font that is part of a theme definition
    //  is updated to use the new "major" or "minor" font definition for that theme.
    //  Usually "major" fonts are used for styles like headings,
    //  and "minor" fonts are used for body and paragraph text."
    //
    // https://hackage.haskell.org/package/xlsx-0.8.4/docs/Codec-Xlsx-Types-StyleSheet.html
    //
    if (!custom) {
      xml += '<scheme val="minor"/>';
    }
    if (weight === 'bold') {
      xml += '<b/>';
    }
    if (style === 'italic') {
      xml += '<i/>';
    }
    xml += '</font>';
  }
  xml += '</fonts>';

  // MS Office 2007 Excel seems to require a `<fills/>` element to exist.
  // without it, MS Office 2007 Excel thinks that the file is broken.
  xml += "<fills count=\"".concat(fills.length, "\">");
  for (var _iterator2 = _createForOfIteratorHelperLoose(fills), _step2; !(_step2 = _iterator2()).done;) {
    var fill = _step2.value,
        _color = fill.color,
        _fillPattern = fill.fillPattern || "solid",
        _patternColor = fill.patternColor,
        gray125 = fill.gray125;
    xml += '<fill>';
    if (_color) {
      xml += `<patternFill patternType="${_fillPattern}">`;
      xml += '<fgColor rgb="'.concat($attr(getColor((_fillPattern !== "solid" && _patternColor ? _patternColor : _color))), '"/>');
      xml += '<bgColor ' + (_fillPattern !== "solid" && _patternColor ? 'rgb="' + $attr(getColor(_color)) : 'indexed="64') + '"/>'
      xml += '</patternFill>';
    } else if (gray125) {
      // "gray125" fill.
      // For some weird reason, MS Office 2007 Excel seems to require that to be present.
      // Otherwise, if absent, it would replace the first `backgroundColor`.
      xml += '<patternFill patternType="gray125"/>';
    } else {
      xml += '<patternFill patternType="none"/>';
    }
    xml += '</fill>';
  }
  xml += '</fills>';

  // MS Office 2007 Excel seems to require a `<borders/>` element to exist:
  // without it, MS Office 2007 Excel thinks that the file is broken.
  xml += "<borders count=\"".concat(borders.length, "\">");
  for (var _iterator3 = _createForOfIteratorHelperLoose(borders), _step3; !(_step3 = _iterator3()).done;) {
    var border = _step3.value;
    var left = border.left,
      right = border.right,
      top = border.top,
      bottom = border.bottom;
    var getBorderXml = function getBorderXml(direction, _ref2) {
      var style = _ref2.style,
        color = _ref2.color;
      if (color && !style) {
        style = 'thin';
      }
      var hasChildren = color ? true : false;
      return "<".concat(direction) + (style ? " style=\"".concat($attr(style), "\"") : '') + (hasChildren ? '>' : '/>') + (color ? "<color rgb=\"".concat($attr(getColor(color)), "\"/>") : '') + (hasChildren ? "</".concat(direction, ">") : '');
    };
    xml += '<border>';
    xml += getBorderXml('left', left);
    xml += getBorderXml('right', right);
    xml += getBorderXml('top', top);
    xml += getBorderXml('bottom', bottom);
    xml += '<diagonal/>';
    xml += '</border>';
  }
  xml += '</borders>';

  // What are `<cellXfs/>` and `<cellStyleXfs/>`:
  // http://officeopenxml.com/SSstyles.php
  //
  // `<cellStyleXfs/>` are referenced from `<cellXfs/>` as `<xf xfId="..."/>`.
  // `<cellStyleXfs/>` defines abstract "cell styles" that can be "extended"
  // by "cell styles" defined by `<cellXfs/>` that can be applied to individual cells:
  // 1. `<cellStyleXfs><xf .../></cellStyleXfs>`
  // 2. `<cellXfs><xf xfId={cellStyleXfs.xf.index}/></cellXfs>`
  // 3. `<c s={cellXfs.xf.index}/>`
  // Seems like "cell styles" defined by `<cellXfs/>` have to reference
  // some abstract "cell styles" defined by `<cellStyleXfs/>` by the spec.
  // Otherwise, there would be no need to use `<cellStyleXfs/>` at all.
  // The naming is ambiguous and weird. The whole scheme is needlessly redundant.

  // xml += '<cellStyleXfs count="2">'
  // xml += '<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>'
  // // `applyFont="1"` means apply a custom font in this "abstract" "cell style"
  // // rather than using a default font.
  // // Seems like by default `applyFont` is `"0"` meaning that,
  // // unless `"1"` is specified, it would ignore the `fontId` attribute.
  // xml += '<xf numFmtId="0" fontId="1" applyFont="1" fillId="0" borderId="0"/>'
  // xml += '</cellStyleXfs>'

  xml += "<cellXfs count=\"".concat(styles.length, "\">");
  for (var _iterator4 = _createForOfIteratorHelperLoose(styles), _step4; !(_step4 = _iterator4()).done;) {
    var cellStyle = _step4.value;
    var fontId = cellStyle.fontId,
      fillId = cellStyle.fillId,
      borderId = cellStyle.borderId,
      align = cellStyle.align,
      alignVertical = cellStyle.alignVertical,
      textRotation = cellStyle.textRotation,
      indent = cellStyle.indent,
      wrap = cellStyle.wrap,
      formatId = cellStyle.formatId;
    // `applyNumberFormat="1"` means "apply the `numFmtId` attribute".
    // Seems like by default `applyNumberFormat` is `"0"` meaning that,
    // unless `"1"` is specified, it would ignore the `numFmtId` attribute.
    xml += '<xf ' + [formatId !== undefined ? "numFmtId=\"".concat(formatId, "\"") : undefined, formatId !== undefined ? 'applyNumberFormat="1"' : undefined, fontId !== undefined ? "fontId=\"".concat(fontId, "\"") : undefined, fontId !== undefined ? 'applyFont="1"' : undefined, fillId !== undefined ? "fillId=\"".concat(fillId, "\"") : undefined, fillId !== undefined ? 'applyFill="1"' : undefined, borderId !== undefined ? "borderId=\"".concat(borderId, "\"") : undefined, borderId !== undefined ? 'applyBorder="1"' : undefined, align || alignVertical || textRotation || indent || wrap ? 'applyAlignment="1"' : undefined
    // 'xfId="0"'
    ].filter(function (_) {
      return _;
    }).join(' ') + '>' + (
    // Possible horizontal alignment values:
    //  left, center, right, fill, justify, center_across, distributed.
    // Possible vertical alignment values:
    //  top, vcenter, bottom, vjustify, vdistributed.
    // https://xlsxwriter.readthedocs.io/format.html#set_align
    align || alignVertical || textRotation || indent || wrap ? '<alignment' + (align ? " horizontal=\"".concat($attr(align), "\"") : '') + (alignVertical ? " vertical=\"".concat($attr(alignVertical), "\"") : '') + (textRotation ? " textRotation=\"".concat(getTextRotation(validateTextRotation(textRotation)), "\"") : '') + (indent ? " indent=\"".concat($attr(String(indent)), "\"") : '') + (wrap ? " wrapText=\"1\"" : '') + '/>' : '') + '</xf>';
  }
  xml += "</cellXfs>";

  if (conditionalStyles.length != 0) {
    let totalStyles = 0;
    for (let i = 0; i < Object.keys(conditionalStyles).length; i++) {
      totalStyles += conditionalStyles[i].length;
    }
    xml += `<dxfs count="${totalStyles}">`

    for (let i = 0; i < conditionalStyles.length; i++) {
      for (let j = 0; j < conditionalStyles[i].length; j++) {
        let conditionalStyle = conditionalStyles[i][j];
        xml += "<dxf>";
          if (conditionalStyle.fontColor) {
            xml += `<font><color rgb="${conditionalStyle.fontColor}"/></font>`
          }
        xml += "</dxf>";
      }
    }

    xml += "</dxfs>"
  }

  xml += '</styleSheet>';
  return xml;
}
function getColor(color) {
  if (color[0] !== '#') {
    throw new Error("Color \"".concat(color, "\" must start with a \"#\""));
  }
  return "FF".concat(color.slice('#'.length).toUpperCase());
}

// Validates text rotation parameter value.
// Text rotation parameter value could be from -90 to 90.
// Positive values rotate the text counterclockwise, and negative values rotate the text clockwise.
//
// The spec-compliant `textRotation` parameter value is weird.
// See `getTextRotation()` function comments.
//
// I've searched the internet on how other libraries expect text rotation parameter to look like.
// The consensus seems to be "-90...90" so that it's not as weird as the official spec defines it.
//
// In ClosedXML .NET library, it allows the values from -90 to 90:
// https://docs.closedxml.io/en/latest/features/cell-format.html#orientation
//
// In XlsxWriter Python library, it's -90 to 90 with 270 as a special magic value:
// https://xlsxwriter.readthedocs.io/format.html#format-set-rotation
//
// In Apache POI, it's also -90 to 90 and 255 as a special magic value:
// https://copyprogramming.com/howto/how-to-rotate-text-in-a-spreadsheet-cell-using-apache-poi
//
// "Specify the angle of rotation for the text within the cell.
//  The degree of rotation can range between -90 and 90 degrees, or it can be set to 0xff for vertical alignment."
//
// So -90 to 90 seems like a common-practice value range.
//
function validateTextRotation(textRotation) {
  if (!(textRotation >= -90 && textRotation <= 90)) {
    throw new Error("Unsupported text rotation angle: ".concat(textRotation, ". Values from -90 to 90 are supported."));
  }
  return textRotation;
}

// Transforms `textRotation` parameter value to the spec-compliant form.
//
// The XLSX specification for the value of `textRotation` is weird:
// https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.alignment?view=openxml-2.8.1
//
// "Text rotation in cells. Expressed in degrees. Values range from 0 to 180.
//  The first letter of the text is considered the center-point of the arc.
//  For 0 - 90, the value represents degrees above horizon.
//  For 91-180 the degrees below the horizon is calculated as:
//  [degrees below horizon] = 90 - textRotation"
//
function getTextRotation(textRotation) {
  if (textRotation < 0) {
    return 90 - textRotation;
  }
  return textRotation;
}
//# sourceMappingURL=styles.xml.js.map