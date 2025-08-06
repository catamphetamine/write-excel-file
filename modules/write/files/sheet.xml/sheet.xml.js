// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/zipcelx.js
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/templates/worksheet.xml.js

import generateRows from './rows.js';
import generateColumnsDescription from './columns.js';
import processMergedCells from './processMergedCells.js';
import generateMergedCellsDescription from './mergedCellsDescription.js';
import generateLayout from './layout.js';
import generateViews from './views.js';
import generateDrawing from './drawing.js';
var SHEET_XML_TEMPLATE = "<?xml version=\"1.0\" ?>\n<worksheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" xmlns:mv=\"urn:schemas-microsoft-com:mac:vml\" xmlns:mx=\"http://schemas.microsoft.com/office/mac/excel/2008/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:x14=\"http://schemas.microsoft.com/office/spreadsheetml/2009/9/main\" xmlns:x14ac=\"http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac\" xmlns:xm=\"http://schemas.microsoft.com/office/excel/2006/main\">{views}{columnsDescription}<sheetData>{data}</sheetData>{mergedCellsDescription}{layout}{drawing}</worksheet>";
export default function generateSheetXml(data_, _ref) {
  var schema = _ref.schema,
    columns = _ref.columns,
    images = _ref.images,
    getHeaderStyle = _ref.getHeaderStyle,
    getStyle = _ref.getStyle,
    getSharedString = _ref.getSharedString,
    customFont = _ref.customFont,
    dateFormat = _ref.dateFormat,
    orientation = _ref.orientation,
    stickyRowsCount = _ref.stickyRowsCount,
    stickyColumnsCount = _ref.stickyColumnsCount,
    showGridLines = _ref.showGridLines,
    rightToLeft = _ref.rightToLeft,
    sheetId = _ref.sheetId;
  validateData(data_, {
    schema: schema
  });
  var _processMergedCells = processMergedCells(data_, {
      schema: schema
    }),
    data = _processMergedCells.data,
    mergedCells = _processMergedCells.mergedCells;
  return SHEET_XML_TEMPLATE.replace('{data}', generateRows(data, {
    schema: schema,
    getHeaderStyle: getHeaderStyle,
    getStyle: getStyle,
    getSharedString: getSharedString,
    customFont: customFont,
    dateFormat: dateFormat
  })).replace('{views}', generateViews({
    stickyRowsCount: stickyRowsCount,
    stickyColumnsCount: stickyColumnsCount,
    showGridLines: showGridLines,
    rightToLeft: rightToLeft
  })).replace('{columnsDescription}', generateColumnsDescription({
    schema: schema,
    columns: columns
  })).replace('{mergedCellsDescription}', generateMergedCellsDescription(mergedCells)).replace('{layout}', generateLayout({
    sheetId: sheetId,
    orientation: orientation
  })).replace('{drawing}', generateDrawing({
    images: images
  }));
}
function validateData(data, _ref2) {
  var schema = _ref2.schema;
  if (schema) {
    if (!Array.isArray(data)) {
      throw new TypeError('Expected an array of objects');
    }
  } else {
    if (!Array.isArray(data)) {
      throw new TypeError('Expected an array of arrays');
    }
    if (data.length > 0) {
      if (!Array.isArray(data[0])) {
        throw new TypeError('Expected an array of arrays');
      }
    }
  }
}
//# sourceMappingURL=sheet.xml.js.map