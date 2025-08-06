import $attr from '../xml/sanitizeAttributeValue.js';

// There seem to be about 100 "built-in" formats in Excel.
// https://docs.microsoft.com/en-us/previous-versions/office/developer/office-2010/ee857658(v=office.14)?redirectedfrom=MSDN
export var FORMAT_ID_STARTS_FROM = 100;
export default function initStyles(_ref) {
  var defaultFontFamily = _ref.fontFamily,
    defaultFontSize = _ref.fontSize;
  var customFont = Boolean(defaultFontFamily || defaultFontSize);
  if (defaultFontFamily === undefined) {
    defaultFontFamily = 'Calibri';
  }
  if (defaultFontSize === undefined) {
    defaultFontSize = 12;
  }
  var formats = [];
  var formatsIndex = {};
  var styles = [];
  var stylesIndex = {};
  var fonts = [];
  var fontsIndex = {};
  var fills = [];
  var fillsIndex = {};
  var borders = [];
  var bordersIndex = {};

  // Default font.
  fonts.push({
    size: defaultFontSize,
    family: defaultFontFamily,
    custom: customFont
  });
  fontsIndex['-:-'] = 0;

  // Default fill.
  fills.push({});
  fillsIndex['-'] = 0;
  fillsIndex['darkDown'] = 6;

  // Default border.
  borders.push({
    left: {},
    right: {},
    top: {},
    bottom: {}
  });
  bordersIndex['-:-/-:-/-:-/-:-'] = 0;

  // "gray125" fill.
  // For some weird reason, MS Office 2007 Excel seems to require that to be present.
  // Otherwise, if absent, it would replace the first `backgroundColor`.
  fills.push({
    gray125: true
  });
  function getStyle(_ref2, _ref3) {
    var align = _ref2.align,
      alignVertical = _ref2.alignVertical,
      textRotation = _ref2.textRotation,
      indent = _ref2.indent,
      wrap = _ref2.wrap,
      fontFamily = _ref2.fontFamily,
      fontSize = _ref2.fontSize,
      fontWeight = _ref2.fontWeight,
      fontStyle = _ref2.fontStyle,
      color = _ref2.color,
      fillPattern = _ref2.fillPattern,
      patternColor = _ref2.patternColor,
      backgroundColor = _ref2.backgroundColor,
      borderColor = _ref2.borderColor,
      borderStyle = _ref2.borderStyle,
      leftBorderColor = _ref2.leftBorderColor,
      leftBorderStyle = _ref2.leftBorderStyle,
      rightBorderColor = _ref2.rightBorderColor,
      rightBorderStyle = _ref2.rightBorderStyle,
      topBorderColor = _ref2.topBorderColor,
      topBorderStyle = _ref2.topBorderStyle,
      bottomBorderColor = _ref2.bottomBorderColor,
      bottomBorderStyle = _ref2.bottomBorderStyle;
    var format = _ref3.format;
    // Custom borders aren't supported.
    var border = undefined;
    // Look for an existing style.
    var fontKey = "".concat(fontFamily || '-', ":").concat(fontSize || '-', ":").concat(fontWeight || '-', ":").concat(fontStyle || '-', ":").concat(color || '-');
    var fillKey = backgroundColor || '-';
    var borderKey = "".concat(topBorderColor || borderColor || '-', ":").concat(topBorderStyle || borderStyle || '-') + '/' + "".concat(rightBorderColor || borderColor || '-', ":").concat(rightBorderStyle || borderStyle || '-') + '/' + "".concat(bottomBorderColor || borderColor || '-', ":").concat(bottomBorderStyle || borderStyle || '-') + '/' + "".concat(leftBorderColor || borderColor || '-', ":").concat(leftBorderStyle || borderStyle || '-');
    var key = "".concat(align || '-', "/").concat(alignVertical || '-', "/").concat(textRotation || '-', "/").concat(indent || '-', "/").concat(wrap || '-', "/").concat(format || '-', "/").concat(fontKey, "/").concat(fillKey, "/").concat(borderKey);
    var styleId = stylesIndex[key];
    if (styleId !== undefined) {
      return styleId;
    }
    // Create new style.
    // Get format ID.
    var formatId;
    if (format) {
      formatId = formatsIndex[format];
      if (formatId === undefined) {
        formatId = formatsIndex[format] = String(FORMAT_ID_STARTS_FROM + formats.length);
        formats.push(format);
      }
    }
    // Get font ID.
    var fontId = customFont ? 0 : undefined;
    if (fontFamily || fontSize || fontWeight || fontStyle || color) {
      fontId = fontsIndex[fontKey];
      if (fontId === undefined) {
        fontId = fontsIndex[fontKey] = String(fonts.length);
        fonts.push({
          custom: true,
          size: fontSize || defaultFontSize,
          family: fontFamily || defaultFontFamily,
          weight: fontWeight,
          style: fontStyle,
          color: color
        });
      }
    }
    // Get fill ID.
    var fillId;
    if (backgroundColor) {
      if (fillPattern) {
        fillId = fillsIndex[fillPattern];
        fills.push({
          color: backgroundColor,
          fillPattern: fillPattern,
          patternColor: patternColor
        });
      } else {
        fillId = fillsIndex[fillKey];
        if (fillId === undefined) {
          fillId = fillsIndex[fillKey] = String(fills.length);
          fills.push({
            color: backgroundColor
          });
        }
      }
    }
    // Get border ID.
    var borderId;
    if (borderColor || borderStyle || leftBorderColor || leftBorderStyle || rightBorderColor || rightBorderStyle || topBorderColor || topBorderStyle || bottomBorderColor || bottomBorderStyle) {
      borderId = bordersIndex[borderKey];
      if (borderId === undefined) {
        borderId = bordersIndex[borderKey] = String(borders.length);
        borders.push({
          left: {
            style: leftBorderStyle || borderStyle,
            color: leftBorderColor || borderColor
          },
          right: {
            style: rightBorderStyle || borderStyle,
            color: rightBorderColor || borderColor
          },
          top: {
            style: topBorderStyle || borderStyle,
            color: topBorderColor || borderColor
          },
          bottom: {
            style: bottomBorderStyle || borderStyle,
            color: bottomBorderColor || borderColor
          }
        });
      }
    }
    // Add a style.
    styles.push({
      fontId: fontId,
      fillId: fillId,
      borderId: borderId,
      align: align,
      alignVertical: alignVertical,
      textRotation: textRotation,
      indent: indent,
      wrap: wrap,
      formatId: formatId
    });
    return stylesIndex[key] = String(styles.length - 1);
  }

  // Add the default style.
  getStyle({}, {});
  return {
    getStyles: function getStyles() {
      return {
        formats: formats,
        styles: styles,
        fonts: fonts,
        fills: fills,
        borders: borders
      };
    },
    getStyle: getStyle
  };
}
//# sourceMappingURL=styles.js.map