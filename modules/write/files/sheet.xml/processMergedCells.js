import getCellStyleProperties from './helpers/getCellStyleProperties.js';

// Supports "merging cells" across columns and rows.
// https://rdrr.io/cran/openxlsx/man/mergeCells.html
//
// Returned result example for merged cells range "A2:C3":
// { mergedCells: [ [0, 1], [2, 2] ] }
//
// Data example:
//
// rows:
// [
//   [...],
//   [
//     { type: String, value: 'abc', span: 3, rowSpan: 2 },
//     { ... },
//     { ... }
//   ],
//   [...]
// ]

export default function processMergedCells(data, _ref) {
  var schema = _ref.schema;
  var mergedCells = [];
  if (schema) {
    return {
      data: data,
      mergedCells: mergedCells
    };
  }
  var _cloneData = function cloneData() {
    // The code will apply the style from the originating "merged" cells
    // to their adjacent `null` cells, so clone `data` to prevent mutating it.
    data = data.slice();
    // Also clone each row of `data`.
    var i = 0;
    while (i < data.length) {
      data[i] = data[i].slice();
      i++;
    }
    // `data` has been cloned. No need to clone it again.
    _cloneData = function cloneData() {
      return data;
    };
    // Return the cloned `data`.
    return data;
  };
  var rowIndex = 0;
  while (rowIndex < data.length) {
    var row = data[rowIndex];
    var columnIndex = 0;
    while (columnIndex < row.length) {
      var cell = row[columnIndex];
      if (cell) {
        var _cell$span = cell.span,
          span = _cell$span === void 0 ? 1 : _cell$span,
          _cell$rowSpan = cell.rowSpan,
          rowSpan = _cell$rowSpan === void 0 ? 1 : _cell$rowSpan;
        if (span > 1 || rowSpan > 1) {
          // Validate that `span`-ning or `rowSpan`-ning cells only overlap
          // `null` or `undefined` ones. Especially that `span`-ning or `rowSpan`-ning cells
          // don't overlap other `span`-ning or `rowSpan`-ning cells.
          processSpanningCells({
            data: data,
            rowIndex: rowIndex,
            columnIndex: columnIndex,
            span: span,
            rowSpan: rowSpan,
            cloneData: _cloneData
          });

          // Add "merged cells" entry:
          // `[ [fromRowIndex, fromColumnIndex], [toRowIndex, toColumnIndex] ]`.
          mergedCells.push([[rowIndex, columnIndex], [rowIndex + (rowSpan ? rowSpan - 1 : 0), columnIndex + (span ? span - 1 : 0)]]);
        }
      }
      columnIndex++;
    }
    rowIndex++;
  }
  return {
    data: data,
    mergedCells: mergedCells
  };
}

// Validate that a `span`-ning / `rowSpan`-ning cell doesn't overlap
// with other cells, especially `span`-ning / `rowSpan`-ning ones,
// because those ones would make MS Office 2007 Excel say:
// "Excel found unreadable content in 'file.xlsx'.
//  Do you want to recover the contents of this workbook?
//  If you trust the source of this workbook, click Yes".
function processSpanningCells(_ref2) {
  var data = _ref2.data,
    rowIndex = _ref2.rowIndex,
    columnIndex = _ref2.columnIndex,
    span = _ref2.span,
    rowSpan = _ref2.rowSpan,
    cloneData = _ref2.cloneData;
  var cellStyleProperties = getCellStyleProperties(data[rowIndex][columnIndex]);
  if (cellStyleProperties) {
    data = cloneData();
  }
  var i = rowIndex;
  while (i <= rowIndex + (rowSpan - 1)) {
    var j = columnIndex;
    while (j <= columnIndex + (span - 1)) {
      var cell = data[i][j];
      if (i > rowIndex || j > columnIndex) {
        // Validate that all hidden cells are `null` or `undefined`.
        if (cell !== null && cell !== undefined) {
          throw new Error("[write-excel-file] When using `span` or `rowSpan` parameters, all hidden overlapped cells should be represented by `null`s or `undefined`s. Cell at row ".concat(rowIndex + 1, " and column ").concat(columnIndex + 1, " is configured with `span` ").concat(span, " and `rowSpan` ").concat(rowSpan, ". Cell at row ").concat(i + 1, " and column ").concat(j + 1, " is neither `null` nor `undefined`: ").concat(JSON.stringify(cell)));
        }
        // Apply the style from the original cell to this `null` cell.
        // https://gitlab.com/catamphetamine/write-excel-file/-/issues/43
        if (cellStyleProperties) {
          data[i][j] = cellStyleProperties;
        }
      }
      j++;
    }
    i++;
  }
}
//# sourceMappingURL=processMergedCells.js.map