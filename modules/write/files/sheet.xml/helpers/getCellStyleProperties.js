export default function getCellStyleProperties(cell) {
  var align = cell.align,
    alignVertical = cell.alignVertical,
    textRotation = cell.textRotation,
    indent = cell.indent,
    wrap = cell.wrap,
    fontFamily = cell.fontFamily,
    fontSize = cell.fontSize,
    fontWeight = cell.fontWeight,
    fontStyle = cell.fontStyle,
    color = cell.color,
    fillPattern = cell.fillPattern,
    patternColor = cell.patternColor,
    backgroundColor = cell.backgroundColor,
    borderColor = cell.borderColor,
    borderStyle = cell.borderStyle,
    leftBorderColor = cell.leftBorderColor,
    leftBorderStyle = cell.leftBorderStyle,
    rightBorderColor = cell.rightBorderColor,
    rightBorderStyle = cell.rightBorderStyle,
    topBorderColor = cell.topBorderColor,
    topBorderStyle = cell.topBorderStyle,
    bottomBorderColor = cell.bottomBorderColor,
    bottomBorderStyle = cell.bottomBorderStyle;
  if (align || alignVertical || textRotation || indent || wrap || fontFamily || fontSize || fontWeight || fontStyle || color || fillPattern || patternColor || backgroundColor || borderColor || borderStyle || leftBorderColor || leftBorderStyle || rightBorderColor || rightBorderStyle || topBorderColor || topBorderStyle || bottomBorderColor || bottomBorderStyle) {
    return omitUndefinedProperties({
      align: align,
      alignVertical: alignVertical,
      textRotation: textRotation,
      indent: indent,
      wrap: wrap,
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
      color: color,
      fillPattern: fillPattern,
      patternColor: patternColor,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderStyle: borderStyle,
      leftBorderColor: leftBorderColor,
      leftBorderStyle: leftBorderStyle,
      rightBorderColor: rightBorderColor,
      rightBorderStyle: rightBorderStyle,
      topBorderColor: topBorderColor,
      topBorderStyle: topBorderStyle,
      bottomBorderColor: bottomBorderColor,
      bottomBorderStyle: bottomBorderStyle
    });
  }
}
function omitUndefinedProperties(object) {
  var filteredObject = {};
  for (var key in object) {
    if (object[key] !== undefined) {
      filteredObject[key] = object[key];
    }
  }
  return filteredObject;
}
//# sourceMappingURL=getCellStyleProperties.js.map