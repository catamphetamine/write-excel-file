import getAttributesString from '../../xml/getAttributesString.js'
import getCellCoordinate from '../helpers/getCellCoordinate.js'

export default {
	files: {
		transform: {
			'xl/worksheets/sheet{id}.xml': {
				transform(xml, { stickyRowsCount, stickyColumnsCount }) {
					if (stickyRowsCount || stickyColumnsCount) {
						const paneAttributes = {
							ySplit: stickyRowsCount || 0,
							xSplit: stickyColumnsCount || 0,
							topLeftCell: getCellCoordinate(stickyRowsCount || 0, stickyColumnsCount || 0),
							// `activePane` defines which pane is currently active in a split or frozen worksheet view.
							activePane: 'bottomRight',
							// `state: "frozen"` indicates that the panes are frozen, meaning the split area
							// (usually top rows or leftmost columns) remains fixed while the rest of the sheet scrolls.
							// Other possible values:
							// "split" — Indicates that the window is split into separate panes that can be scrolled independently, but are not locked in place.
							// "frozenSplit" — A combination used in specific scenarios (often by Excel itself) to manage complex freezing.
							state: 'frozen'
						}
						return xml.replace('</sheetView>', `<pane${getAttributesString(paneAttributes)}/>` + '</sheetView>')
					}
					return xml
				},

				// These parameters will be passed through to the function above.
				parameters: (availableParameters) => {
					const { stickyRowsCount, stickyColumnsCount } = availableParameters
					return { stickyRowsCount, stickyColumnsCount }
				}
			},

			'xl/workbook.xml': {
				// For some weird reason, Excel 2007 demands `<conditionalFormatting/>` element to go before `<sheets/>` element.
				// Because `<sheets/>` element is added before any of the `insert()`s of any features,
				// this feature has to use a `transform()` function instead of an `insert()` function.
				transform: (xml, { stickyRowsCount, stickyColumnsCount }) => {
					if (stickyRowsCount || stickyColumnsCount) {
						return xml.replace('<sheets>', '<bookViews><workbookView/></bookViews>' + '<sheets>')
					}
					return xml
				},

				// These parameters will be passed through to the function above.
				parameters: (availableParameters) => {
					const { stickyRowsCount, stickyColumnsCount } = availableParameters
					return { stickyRowsCount, stickyColumnsCount }
				}
			}
		}
	}
}