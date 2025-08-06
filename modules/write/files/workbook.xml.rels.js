// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/statics/workbook.xml.rels.js

export default function generateWorkbookXmlRels(_ref) {
  var sheets = _ref.sheets;
  return '<?xml version="1.0" ?>' + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + sheets.map(function (_ref2) {
    var id = _ref2.id;
    return "<Relationship Id=\"rId".concat(id, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" Target=\"worksheets/sheet").concat(id, ".xml\"/>");
  }).join('') + "<Relationship Id=\"rId".concat(sheets.length + 1, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings\" Target=\"sharedStrings.xml\"/>") + "<Relationship Id=\"rId".concat(sheets.length + 2, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles\" Target=\"styles.xml\"/>") + '</Relationships>';
}
//# sourceMappingURL=workbook.xml.rels.js.map