import generateCellNumber from './helpers/generateCellNumber.js';
import getAttributesString from '../../../xml/getAttributesString.js';
export default function generateViews(_ref) {
  var stickyRowsCount = _ref.stickyRowsCount,
    stickyColumnsCount = _ref.stickyColumnsCount,
    showGridLines = _ref.showGridLines,
    rightToLeft = _ref.rightToLeft,
    zoomScale = _ref.zoomScale,
    selected = _ref.selected,
    sheetId = _ref.sheetId;
  if (!stickyRowsCount && !stickyColumnsCount && !(showGridLines === false) && !rightToLeft && !zoomScale && !selected) {
    return '';
  }
  var views = '';
  var sheetViewAttributes = {
    tabSelected: selected + 1 === sheetId ? 1 : 0,
    workbookViewId: 0
  };
  if (showGridLines === false) {
    sheetViewAttributes.showGridLines = false;
  }
  if (rightToLeft) {
    sheetViewAttributes.rightToLeft = 1;
  }
  if (zoomScale) {
    sheetViewAttributes.zoomScale = zoomScale;
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