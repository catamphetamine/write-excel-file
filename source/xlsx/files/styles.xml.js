import $attributeValue from '../../xml/sanitizeAttributeValue.js'
import getFillXml from '../helpers/getFillXml.js'
import getBorderXml from '../helpers/getBorderXml.js'
import getFontXml from '../helpers/getFontXml.js'
import hasAlignment from '../helpers/hasAlignment.js'
import getAlignmentXml from '../helpers/getAlignmentXml.js'
import getAdditionalContent from '../helpers/features/getAdditionalContent.js'
import transformContent from '../helpers/features/transformContent.js'

import { FORMAT_ID_STARTS_FROM } from '../initializeStyles.js'

export default function generateStylesXml(parameters, multipleSheetsParameters, features) {
  const {
    formats,
    styles,
    fonts,
    fills,
    borders,
    ...restParameters
  } = parameters

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
      xml += `<numFmt numFmtId="${FORMAT_ID_STARTS_FROM + i}" formatCode="${$attributeValue(formats[i])}"/>`
    }
    xml += `</numFmts>`
  }

  xml += `<fonts count="${fonts.length}">`
  for (const font of fonts) {
    xml += getFontXml(font)
  }
  xml += '</fonts>'

  // MS Office 2007 Excel seems to require a `<fills/>` element to exist.
  // without it, MS Office 2007 Excel thinks that the file is broken.
  xml += `<fills count="${fills.length}">`
  for (const fill of fills) {
    if (fill.gray125) {
      // "gray125" fill.
      // For some weird reason, MS Office 2007 Excel seems to require that to be present.
      // Otherwise, if absent, it would replace the first `backgroundColor`.
      xml += '<fill>'
      xml += '<patternFill patternType="gray125"/>'
      xml += '</fill>'
    } else {
      xml += getFillXml(fill)
    }
  }
  xml += '</fills>'

  // MS Office 2007 Excel seems to require a `<borders/>` element to exist:
  // without it, MS Office 2007 Excel thinks that the file is broken.
  xml += `<borders count="${borders.length}">`
  for (const border of borders) {
    xml += getBorderXml(border)
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
      alignment,
      formatId
    } = cellStyle
    // `applyNumberFormat="1"` means "apply the `numFmtId` attribute".
    // Seems like by default `applyNumberFormat` is `"0"` meaning that,
    // unless `"1"` is specified, it would ignore the `numFmtId` attribute.
    xml += '<xf ' +
      [
        formatId === undefined ? undefined : `numFmtId="${formatId}" applyNumberFormat="1"`,
        fontId === undefined ? undefined : `fontId="${fontId}" applyFont="1"`,
        fillId === undefined ? undefined : `fillId="${fillId}" applyFill="1"`,
        borderId === undefined ? undefined : `borderId="${borderId}" applyBorder="1"`,
        hasAlignment(alignment) ? 'applyAlignment="1"' : undefined,
        // 'xfId="0"'
      ].filter(_ => _).join(' ') +
    '>' +
      // Possible horizontal alignment values:
      //  left, center, right, fill, justify, center_across, distributed.
      // Possible vertical alignment values:
      //  top, vcenter, bottom, vjustify, vdistributed.
      // https://xlsxwriter.readthedocs.io/format.html#set_align
      (hasAlignment(alignment) ? getAlignmentXml(alignment) : '') +
    '</xf>'
  }
  xml += `</cellXfs>`

  // Apply any plugins that insert additional content to this XML.
  xml += getAdditionalContent(
    'xl/styles.xml',
    features,
    restParameters,
    { multipleSheetsParameters }
  )

  xml += '</styleSheet>'

  // Apply any plugins that transform this XML.
  xml = transformContent(
    xml,
    'xl/styles.xml',
    features,
    restParameters,
    { multipleSheetsParameters }
  )

  return xml
}