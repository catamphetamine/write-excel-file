import $attr from '../xml/sanitizeAttributeValue.js'

// There seem to be about 100 "built-in" formats in Excel.
// https://docs.microsoft.com/en-us/previous-versions/office/developer/office-2010/ee857658(v=office.14)?redirectedfrom=MSDN
export const FORMAT_ID_STARTS_FROM = 100

export default function initStyles({
  fontFamily: defaultFontFamily,
  fontSize: defaultFontSize
}) {
  const customFont = Boolean(defaultFontFamily || defaultFontSize)

  if (defaultFontFamily === undefined) {
    defaultFontFamily = 'Calibri'
  }

  if (defaultFontSize === undefined) {
    defaultFontSize = 12
  }

  const formats = []
  const formatsIndex = {}

  const styles = []
  const stylesIndex = {}

  const fonts = []
  const fontsIndex = {}

  const fills = []
  const fillsIndex = {}

  const borders = []
  const bordersIndex = {}

  // Default font.
  fonts.push({
    size: defaultFontSize,
    family: defaultFontFamily,
    custom: customFont
  })
  fontsIndex['-:-'] = 0

  // Default fill.
  fills.push({})
  fillsIndex['-'] = 0

  // Default border.
  borders.push({
    left: {},
    right: {},
    top: {},
    bottom: {}
  })
  bordersIndex['-:-/-:-/-:-/-:-'] = 0

  // "gray125" fill.
  // For some weird reason, MS Office 2007 Excel seems to require that to be present.
  // Otherwise, if absent, it would replace the first `backgroundColor`.
  fills.push({
    gray125: true
  })

  function getStyle({
    align,
    alignVertical,
    textRotation,
    indent,
    wrap,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    color,
    backgroundColor,
    borderColor,
    borderStyle,
    leftBorderColor,
    leftBorderStyle,
    rightBorderColor,
    rightBorderStyle,
    topBorderColor,
    topBorderStyle,
    bottomBorderColor,
    bottomBorderStyle
  }, {
    format
  }) {
    // Custom borders aren't supported.
    const border = undefined
    // Look for an existing style.
    const fontKey = `${fontFamily || '-'}:${fontSize || '-'}:${fontWeight || '-'}:${fontStyle || '-'}:${color || '-'}`
    const fillKey = backgroundColor || '-'
    const borderKey =
      `${(topBorderColor || borderColor) || '-'}:${(topBorderStyle || borderStyle) || '-'}` +
      '/' +
      `${(rightBorderColor || borderColor) || '-'}:${(rightBorderStyle || borderStyle) || '-'}` +
      '/' +
      `${(bottomBorderColor || borderColor) || '-'}:${(bottomBorderStyle || borderStyle) || '-'}` +
      '/' +
      `${(leftBorderColor || borderColor) || '-'}:${(leftBorderStyle || borderStyle) || '-'}`
    const key = `${align || '-'}/${alignVertical || '-'}/${textRotation || '-'}/${indent || '-'}/${wrap || '-'}/${format || '-'}/${fontKey}/${fillKey}/${borderKey}`
    const styleId = stylesIndex[key]
    if (styleId !== undefined) {
      return styleId
    }
    // Create new style.
    // Get format ID.
    let formatId
    if (format) {
      formatId = formatsIndex[format]
      if (formatId === undefined) {
        formatId = formatsIndex[format] = String(FORMAT_ID_STARTS_FROM + formats.length)
        formats.push(format)
      }
    }
    // Get font ID.
    let fontId = customFont ? 0 : undefined
    if (fontFamily || fontSize || fontWeight || fontStyle || color) {
      fontId = fontsIndex[fontKey]
      if (fontId === undefined) {
        fontId = fontsIndex[fontKey] = String(fonts.length)
        fonts.push({
          custom: true,
          size: fontSize || defaultFontSize,
          family: fontFamily || defaultFontFamily,
          weight: fontWeight,
          style: fontStyle,
          color
        })
      }
    }
    // Get fill ID.
    let fillId
    if (backgroundColor) {
      fillId = fillsIndex[fillKey]
      if (fillId === undefined) {
        fillId = fillsIndex[fillKey] = String(fills.length)
        fills.push({
          color: backgroundColor
        })
      }
    }
    // Get border ID.
    let borderId
    if (
      borderColor ||
      borderStyle ||
      leftBorderColor ||
      leftBorderStyle ||
      rightBorderColor ||
      rightBorderStyle ||
      topBorderColor ||
      topBorderStyle ||
      bottomBorderColor ||
      bottomBorderStyle
    ) {
      borderId = bordersIndex[borderKey]
      if (borderId === undefined) {
        borderId = bordersIndex[borderKey] = String(borders.length)
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
        })
      }
    }
    // Add a style.
    styles.push({
      fontId,
      fillId,
      borderId,
      align,
      alignVertical,
      textRotation,
      indent,
      wrap,
      formatId
    })
    return stylesIndex[key] = String(styles.length - 1)
  }

  // Add the default style.
  getStyle({}, {})

  return {
    getStyles() {
      return { formats, styles, fonts, fills, borders }
    },
    getStyle
  }
}