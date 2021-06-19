const fontSize = 12
const fontFamily = 'Calibri'

// There seem to be about 100 "built-in" formats in Excel.
// https://docs.microsoft.com/en-us/previous-versions/office/developer/office-2010/ee857658(v=office.14)?redirectedfrom=MSDN
const FORMAT_ID_STARTS_FROM = 100

export default function initStyles() {
  const formats = []
  const formatsIndex = {}

  const styles = []
  const stylesIndex = {}

  function getStyle({ fontWeight, align, format }) {
    const key = `${fontWeight || 'normal'}/${align || 'none'}/${format || 'none'}`
    const style = stylesIndex[key]
    if (style !== undefined) {
      return style
    }
    let formatId
    if (format) {
      formatId = formatsIndex[format]
      if (formatId === undefined) {
        formatId = formatsIndex[format] = String(FORMAT_ID_STARTS_FROM + formats.length)
        formats.push(format)
      }
    }
    styles.push({
      fontWeight,
      align,
      formatId
    })
    return stylesIndex[key] = String(styles.length - 1)
  }

  // Add the default style.
  getStyle({})

  return {
    getStylesXml() {
      return generateXml({ formats, styles })
    },
    getStyle
  }
}

function generateXml({ formats, styles }) {
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
      xml += `<numFmt numFmtId="${FORMAT_ID_STARTS_FROM + i}" formatCode="${formats[i]}"/>`
    }
    xml += `</numFmts>`
  }

  xml += '<fonts count="2">'
  xml += `<font><sz val="${fontSize}"/><color theme="1"/><name val="${fontFamily}"/><family val="2"/><scheme val="minor"/></font>`
  xml += `<font><sz val="${fontSize}"/><color theme="1"/><name val="${fontFamily}"/><family val="2"/><scheme val="minor"/><b/></font>`
  xml += '</fonts>'

  // MS Office 2007 Excel seems to require a `<fills/>` element to exist.
  // without it, MS Office 2007 Excel thinks that the file is broken.
  xml += '<fills count="1">'
  xml += '<fill><patternFill patternType="none"/></fill>'
  xml += '</fills>'

  // MS Office 2007 Excel seems to require a `<borders/>` element to exist:
  // without it, MS Office 2007 Excel thinks that the file is broken.
  xml += '<borders count="1">'
  xml += '<border><left/><right/><top/><bottom/><diagonal/></border>'
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
      align,
      fontWeight,
      formatId
    } = cellStyle
    const fontId = fontWeight === 'bold' ? 1 : 0
    // `applyNumberFormat="1"` means "apply the `numFmtId` attribute".
    // Seems like by default `applyNumberFormat` is `"0"` meaning that,
    // unless `"1"` is specified, it would ignore the `numFmtId` attribute.
    xml += '<xf ' +
      [
        formatId !== undefined ? `numFmtId="${formatId || 0}"` : undefined,
        formatId !== undefined ? 'applyNumberFormat="1"' : undefined,
        fontId !== undefined ? `fontId="${fontId}"` : undefined,
        fontId !== undefined ? 'applyFont="1"' : undefined,
        // 'fillId="0"',
        // 'borderId="0"',
        // 'xfId="0"',
        align ? 'applyAlignment="1"' : undefined
      ].filter(_ => _).join(' ') +
    '>' +
      // Possible horizontal alignment values:
      //  left, center, right, fill, justify, center_across, distributed.
      // Possible vertical alignment values:
      //  top, vcenter, bottom, vjustify, vdistributed.
      // https://xlsxwriter.readthedocs.io/format.html#set_align
      (align ? `<alignment horizontal="${align}"/>` : '') +
    '</xf>'
  }
  xml += `</cellXfs>`

  // To apply cell content alignment, a `cellXfs.xf` element should specify
  // `applyAlignment="1"` and also contain a child `<alignment/>` element.
  // Examples:
  // `<alignment horizontal="center" vertical="center"/>`
  // `<alignment wrapText="1"/>`

  xml += '</styleSheet>'

  return xml
}