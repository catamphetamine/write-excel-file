import $attr from '../../../xml/sanitizeAttributeValue.js';
export default function generateLayout(_ref) {
  var sheetId = _ref.sheetId,
    orientation = _ref.orientation;
  var layout = '';

  // Margins are required when setting custom orientation,
  // otherwise they'd be `0`.
  // https://gitlab.com/catamphetamine/write-excel-file/-/issues/7#note_782347297
  if (orientation) {
    // Page margins (when printing).
    // https://github.com/randym/axlsx/blob/master/lib/axlsx/workbook/worksheet/page_margins.rb

    var marginLeft = 0.7; // The left margin in inches.
    var marginRight = 0.7; // The right margin in inches.
    var marginTop = 0.75; // The top margin in inches.
    var marginBottom = 0.75; // The bottom margin in inches.
    var header = 0.3; // The header margin in inches.
    var footer = 0.3; // The footer margin in inches.

    layout += '<pageMargins';
    layout += " left=\"".concat(marginLeft, "\"");
    layout += " right=\"".concat(marginRight, "\"");
    layout += " top=\"".concat(marginTop, "\"");
    layout += " bottom=\"".concat(marginBottom, "\"");
    layout += " header=\"".concat(header, "\"");
    layout += " footer=\"".concat(footer, "\"");
    layout += '/>';
  }

  // Allows setting "landscape" orientation.
  // https://gitlab.com/catamphetamine/write-excel-file/-/issues/7
  if (orientation) {
    // Paper size (when printing).
    // https://github.com/randym/axlsx/blob/master/lib/axlsx/workbook/worksheet/page_setup.rb
    //
    // `paperSize` `9` means "A4 paper (210 mm by 297 mm)".
    //
    var paperSize = 9;

    // Page orientation (when printing).
    //
    // `orientation` can be:
    // * `landscape`
    // * `portrait`
    // https://docs.microsoft.com/en-us/office/vba/api/excel.pagesetup.orientation

    layout += '<pageSetup';
    layout += " paperSize=\"".concat(paperSize, "\"");
    layout += " orientation=\"".concat($attr(orientation), "\"");
    layout += " r:id=\"rId".concat(sheetId, "\"");
    layout += '/>';
  }
  return layout;
}
//# sourceMappingURL=layout.js.map