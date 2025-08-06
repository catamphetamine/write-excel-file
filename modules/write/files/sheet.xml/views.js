import generateCellNumber from './helpers/generateCellNumber.js';
import getAttributesString from '../../../xml/getAttributesString.js';
export default function generateViews(_ref) {
  var stickyRowsCount = _ref.stickyRowsCount,
    stickyColumnsCount = _ref.stickyColumnsCount,
    showGridLines = _ref.showGridLines,
    rightToLeft = _ref.rightToLeft;
  if (!stickyRowsCount && !stickyColumnsCount && !(showGridLines === false) && !rightToLeft) {
    return '';
  }
  var views = '';
  var sheetViewAttributes = {
    tabSelected: 1,
    workbookViewId: 0
  };
  if (showGridLines === false) {
    sheetViewAttributes.showGridLines = false;
  }
  if (rightToLeft) {
    sheetViewAttributes.rightToLeft = 1;
  }
  var paneAttributes = {
    ySplit: stickyRowsCount || 0,
    xSplit: stickyColumnsCount || 0,
    topLeftCell: generateCellNumber(stickyColumnsCount || 0, (stickyRowsCount || 0) + 1),
    activePane: 'bottomRight',
    state: 'frozen'
  };
  views += '<sheetViews>';
  views += "<sheetView".concat(getAttributesString(sheetViewAttributes), ">");
  views += "<pane".concat(getAttributesString(paneAttributes), "/>");
  views += '</sheetView>';
  views += '</sheetViews>';
  return views;
}
//# sourceMappingURL=views.js.map