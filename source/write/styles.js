import $attr from '../xml/sanitizeAttributeValue.js'

// There seem to be about 100 "built-in" formats in Excel.
// https://docs.microsoft.com/en-us/previous-versions/office/developer/office-2010/ee857658(v=office.14)?redirectedfrom=MSDN
const FORMAT_ID_STARTS_FROM = 100

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
    const key = `${align || '-'}/${alignVertical || '-'}/${textRotation || '-'}/${format || '-'}/${wrap || '-'}/${fontKey}/${fillKey}/${borderKey}`
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
      wrap,
      formatId
    })
    return stylesIndex[key] = String(styles.length - 1)
  }

  // Add the default style.
  getStyle({}, {})

  return {
    getStylesXml() {
      return generateXml({ formats, styles, fonts, fills, borders })
    },
    getStyle
  }
}

function generateXml({ formats, styles, fonts, fills, borders }) {
  let xml = '<?xml version="1.0" ?>'
  xml += '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'

  // Turns out, as weird as it sounds, the order of XML elements matters to MS Office Excel.
  // https://social.msdn.microsoft.com/Forums/office/en-US/cc47ab65-dab7-4e32-b676-b641aa1e1411/how-to-validate-the-xlsx-that-i-generate?forum=oxmlsdk
  // For example, previously this library was inserting `<cellXfs/>` before `<fonts/>`
  // and that caused MS Office 2007 Excel to throw an error about the file being corrupt:
  // "Excel found unreadable content in '*.xlsx'. Do you want to recover the contents of this workbook?"
  // "Excel was able to open the file by repairing or removing the unreadable content."
  // "Removed Part: /xl/styles.xml part with XML error.  (Styles) Load error. Line 1, column ..."
  // "Repaired Records: Cell information from /xl/worksheets/sheet1.xml part"

  if (formats.length > 0) {
    xml += `<numFmts count="${formats.length}">`
    for (let i = 0; i < formats.length; i++) {
      xml += `<numFmt numFmtId="${FORMAT_ID_STARTS_FROM + i}" formatCode="${$attr(formats[i])}"/>`
    }
    xml += `</numFmts>`
  }

  xml += `<fonts count="${fonts.length}">`
  for (const font of fonts) {
    const {
      size,
      family,
      color,
      weight,
      style,
      custom
    } = font
    xml += '<font>'
    xml += `<sz val="${size}"/>`
    xml += `<color ${color ? 'rgb="' + $attr(getColor(color)) + '"' : 'theme="1"'}/>`
    xml += `<name val="${$attr(family)}"/>`
    // It's not clear what the `<family/>` tag means or does.
    // It seems to always be `<family val="2"/>` even for different
    // font families (Calibri, Arial, etc).
    xml += '<family val="2"/>'
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
      xml += '<scheme val="minor"/>'
    }
    if (weight === 'bold') {
      xml += '<b/>'
    }
    if (style === 'italic') {
      xml += '<i/>'
    }
    xml += '</font>'
  }
  xml += '</fonts>'

  // MS Office 2007 Excel seems to require a `<fills/>` element to exist.
  // without it, MS Office 2007 Excel thinks that the file is broken.
  xml += `<fills count="${fills.length}">`
  for (const fill of fills) {
    const { color, gray125 } = fill
    xml += '<fill>'
    if (color) {
      xml += '<patternFill patternType="solid">'
      xml += `<fgColor rgb="${$attr(getColor(color))}"/>`
      // Whatever that could mean.
      xml += '<bgColor indexed="64"/>'
      xml += '</patternFill>'
    } else if (gray125) {
      // "gray125" fill.
      // For some weird reason, MS Office 2007 Excel seems to require that to be present.
      // Otherwise, if absent, it would replace the first `backgroundColor`.
      xml += '<patternFill patternType="gray125"/>'
    } else {
      xml += '<patternFill patternType="none"/>'
    }
    xml += '</fill>'
  }
  xml += '</fills>'

  // MS Office 2007 Excel seems to require a `<borders/>` element to exist:
  // without it, MS Office 2007 Excel thinks that the file is broken.
  xml += `<borders count="${borders.length}">`
  for (const border of borders) {
    const {
      left,
      right,
      top,
      bottom
    } = border
    const getBorderXml = (direction, { style, color }) => {
      if (color && !style) {
        style = 'thin'
      }
      const hasChildren = color ? true : false
      return `<${direction}` +
        (style ? ` style="${$attr(style)}"` : '') +
        (hasChildren ? '>' : '/>') +
        (color ? `<color rgb="${$attr(getColor(color))}"/>` : '') +
        (hasChildren ? `</${direction}>` : '')
    }
    xml += '<border>'
    xml += getBorderXml('left', left)
    xml += getBorderXml('right', right)
    xml += getBorderXml('top', top)
    xml += getBorderXml('bottom', bottom)
    xml += '<diagonal/>'
    xml += '</border>'
  }
  xml += '</borders>'

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

  xml += `<cellXfs count="${styles.length}">`
  for (const cellStyle of styles) {
    const {
      fontId,
      fillId,
      borderId,
      align,
      alignVertical,
      textRotation,
      wrap,
      formatId
    } = cellStyle
    // `applyNumberFormat="1"` means "apply the `numFmtId` attribute".
    // Seems like by default `applyNumberFormat` is `"0"` meaning that,
    // unless `"1"` is specified, it would ignore the `numFmtId` attribute.
    xml += '<xf ' +
      [
        formatId !== undefined ? `numFmtId="${formatId}"` : undefined,
        formatId !== undefined ? 'applyNumberFormat="1"' : undefined,
        fontId !== undefined ? `fontId="${fontId}"` : undefined,
        fontId !== undefined ? 'applyFont="1"' : undefined,
        fillId !== undefined ? `fillId="${fillId}"` : undefined,
        fillId !== undefined ? 'applyFill="1"' : undefined,
        borderId !== undefined ? `borderId="${borderId}"` : undefined,
        borderId !== undefined ? 'applyBorder="1"' : undefined,
        align || alignVertical || textRotation || wrap ? 'applyAlignment="1"' : undefined,
        // 'xfId="0"'
      ].filter(_ => _).join(' ') +
    '>' +
      // Possible horizontal alignment values:
      //  left, center, right, fill, justify, center_across, distributed.
      // Possible vertical alignment values:
      //  top, vcenter, bottom, vjustify, vdistributed.
      // https://xlsxwriter.readthedocs.io/format.html#set_align
      (align || alignVertical || textRotation || wrap
        ? '<alignment' +
          (align ? ` horizontal="${$attr(align)}"` : '') +
          (alignVertical ? ` vertical="${$attr(alignVertical)}"` : '') +
          (wrap ? ` wrapText="1"` : '') +
          (textRotation ? ` textRotation="${getTextRotation(validateTextRotation(textRotation))}"` : '') +
          '/>'
        : ''
      ) +
    '</xf>'
  }
  xml += `</cellXfs>`

  xml += '</styleSheet>'

  return xml
}

function getColor(color) {
  if (color[0] !== '#') {
    throw new Error(`Color "${color}" must start with a "#"`)
  }
  return `FF${color.slice('#'.length).toUpperCase()}`
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
    throw new Error(`Unsupported text rotation angle: ${textRotation}. Values from -90 to 90 are supported.`);
  }
  return textRotation
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
    return 90 - textRotation
  }
  return textRotation
}