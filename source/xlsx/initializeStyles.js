import hasFont from './helpers/hasFont.js'
import hasFill from './helpers/hasFill.js'
import hasBorder from './helpers/hasBorder.js'

// There seem to be about 100 "built-in" formats in Excel.
// https://docs.microsoft.com/en-us/previous-versions/office/developer/office-2010/ee857658(v=office.14)?redirectedfrom=MSDN
export const FORMAT_ID_STARTS_FROM = 100

export default function initializeStyles(defaultFont) {
  const formats = []
  const formatIdByFormat = {}

  const styles = []
  const stylesIndex = {}

  const fonts = []
  const fontIdByFontKey = {}

  const fills = []
  const fillIdByFillKey = {}

  const borders = []
  const borderIdByBorderKey = {}

  // Add default font.
  const defaultFontId = fonts.length
  fontIdByFontKey[getKey(defaultFont)] = defaultFontId
  fonts.push(defaultFont || {})

  // // If any of the sheets have a default font that is different from the generic one,
  // // add those fonts to the collection.
  // const sheetsDefaultFontIds = sheetsDefaultFonts.map((font) => {
  //   if (font) {
  //     const fontKey = getKey(font)
  //     if (fontIdByFontKey[fontKey] !== undefined) {
  //       return fontIdByFontKey[fontKey]
  //     }
  //     const fontId = fonts.length
  //     fontIdByFontKey[fontKey] = fontId
  //     fonts.push(font)
  //     return fontId
  //   } else {
  //     return defaultFontId
  //   }
  // })

  // Default fill (no color).
  const defaultFill = {}
  fillIdByFillKey[getKey(defaultFill)] = fills.length
  fills.push(defaultFill)

  // Default border.
  const defaultBorder = {}
  borderIdByBorderKey[getKey(defaultBorder)] = borders.length
  borders.push(defaultBorder)

  // Always add a mandatory "gray125" fill.
  // For some weird reason, MS Office 2007 Excel seems to require this type of `<fill>`
  // to always be present in an `*.xslx` document.
  // Otherwise, if this `<fill>` is absent in the document, it would forcefully overwrite
  // the first custom `backgroundColor` with a "gray125" fill.
  const gray125Fill = {
    gray125: true
  }
  fills.push(gray125Fill)

  // Returns a style ID number.
  // Adds a new style if it doesn't exist yet.
  // If it already exists, just reuses the existing one.
  function findOrCreateCellStyle(cellStyle) {
    const {
      format,
      align,
      alignVertical,
      textRotation,
      indent,
      wrap,
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      textDecoration,
      textColor,
      backgroundColor,
      fillPatternStyle,
      fillPatternColor,
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
    } = cellStyle

    // const defaultFont = sheetsDefaultFonts[sheetIndex]
    // const defaultFontId = sheetsDefaultFontIds[sheetIndex]

    const font = {
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      textDecoration,
      textColor
    }

    const fill = {
      backgroundColor,
      fillPatternStyle,
      fillPatternColor
    }

    const border = {
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
    }

    const alignment = {
      align,
      alignVertical,
      textRotation,
      indent,
      wrap
    }

    const formatKey = getKey(format)
    const fontKey = getKey(font)
    const fillKey = getKey(fill)
    const borderKey = getKey(border)
    // const alignmentKey = getKey(alignment)

    const styleKey = getKey(cellStyle)

    // Returns style ID.
    const addStyle = () => {
      // Get format ID.
      let formatId
      if (format) {
        formatId = formatIdByFormat[formatKey]
        if (formatId === undefined) {
          formatId = FORMAT_ID_STARTS_FROM + formats.length
          formatIdByFormat[formatKey] = formatId
          formats.push(format)
        }
      }

      // Get font ID.
      let fontId
      if (hasFont(font)) {
        fontId = fontIdByFontKey[fontKey]
        if (fontId === undefined) {
          fontId = fonts.length
          fontIdByFontKey[fontKey] = fontId
          fonts.push({
            ...font,
            fontSize: font.fontSize || (defaultFont && defaultFont.fontSize),
            fontFamily: font.fontFamily || (defaultFont && defaultFont.fontFamily)
          })
        }
      } else if (defaultFont) {
        fontId = defaultFontId
      }

      // Get fill ID.
      let fillId
      if (hasFill(fill)) {
        fillId = fillIdByFillKey[fillKey]
        if (fillId === undefined) {
          fillId = fills.length
          fillIdByFillKey[fillKey] = fillId
          fills.push({
            backgroundColor,
            fillPatternStyle,
            fillPatternColor
          })
        }
      }

      // Get border ID.
      let borderId
      if (hasBorder(border)) {
        borderId = borderIdByBorderKey[borderKey]
        if (borderId === undefined) {
          borderId = borders.length
          borderIdByBorderKey[borderKey] = borderId
          borders.push(border)
        }
      }

      const styleId = styles.length
      stylesIndex[styleKey] = styleId

      // Add a style.
      styles.push({
        formatId,
        fontId,
        fillId,
        borderId,
        alignment
      })

      return styleId
    }

    // Look for an existing style.
    if (stylesIndex[styleKey] !== undefined) {
      return stylesIndex[styleKey]
    }

    // Create new style if doesn't exist.
    return addStyle()
  }

  // Add default style.
  // It will be used for any cell that doesn't specify any custom style properties.
  findOrCreateCellStyle({})

  return {
    getCellStyles() {
      return {
        formats,
        styles,
        fonts,
        fills,
        borders
      }
    },
    findOrCreateCellStyle
  }
}

function getKey(object) {
  return JSON.stringify(object)
}