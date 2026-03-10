import findElement from '../../xml/findElement.js'
import replaceElement from '../../xml/replaceElement.js'
import prependMarkupInsideElement from '../../xml/prependMarkupInsideElement.js'
import appendMarkupInsideElement from '../../xml/appendMarkupInsideElement.js'
import getCellCoordinate from '../helpers/getCellCoordinate.js'
import getOpeningTagMarkup from '../../xml/getOpeningTagMarkup.js'
import getClosingTagMarkup from '../../xml/getClosingTagMarkup.js'
import getSelfClosingTagMarkup from '../../xml/getSelfClosingTagMarkup.js'
import findElementInsideElement from '../../xml/findElementInsideElement.js'

export default {
	files: {
		transform: {
			'xl/worksheets/sheet{id}.xml': {
				transform(xml, { stickyRowsCount, stickyColumnsCount }, { sheetIndex, sheetId }) {
					if (stickyRowsCount || stickyColumnsCount) {
						const paneAttributes = {
							// The vertical position of the split, in 1/20th of a point (twips),
							// or, when frozen, the number of visible rows in the top pane(s).
							ySplit: stickyRowsCount || 0,
							// The horizontal position of the split, in 1/20th of a point (twips),
							// or, when frozen, the number of visible columns in the left pane(s).
							xSplit: stickyColumnsCount || 0,
							// The visible cell in the top-left corner of the bottom-right pane.
							topLeftCell: getCellCoordinate(stickyRowsCount || 0, stickyColumnsCount || 0),
							// `activePane` defines which pane is active in a "split" or "frozen" `state`.
							// Possible values: "bottomLeft", "bottomRight", "topLeft", "topRight".
							activePane: 'bottomRight',
							// `state: "frozen"` indicates that the panes are frozen, meaning the split area
							// (usually top rows or leftmost columns) remains fixed while the rest of the sheet scrolls.
							// Other possible values:
							// "split" — Indicates that the window is split into separate panes that can be scrolled independently, but are not locked in place.
							// "frozenSplit" — A combination used in specific scenarios (often by Excel itself) to manage complex freezing.
							state: 'frozen'
						}

						const sheetViewElement = findElement(xml, 'sheetView')
						if (sheetViewElement) {
							// Add a `<pane/>` element inside the `<sheetView/>` element.
							// If a `<pane/>` element already exists, it will overwrite it.
							const paneElement = findElementInsideElement(xml, 'pane', sheetViewElement)
							const paneXml = getSelfClosingTagMarkup('pane', paneAttributes)
							if (paneElement) {
								// Overwrite the existing `<pane/>` element.
								// It doesn't seem to be any sense in patching the existing `<pane/>` element
								// because all of its properties would be rewritten anyway in the process.
								xml = replaceElement(xml, paneElement, paneXml)
							} else {
								// Add a `<pane/>` element.
								xml = appendMarkupInsideElement(xml, sheetViewElement, paneXml)
							}
						} else {
							// Add a `<sheetViews/>` element.
							// It isn't supposed to exist when no `<sheetView/>` element is present.
							const sheetViewsElement = findElement(xml, 'sheetViews')
							if (sheetViewsElement) {
								throw new Error(`xl/worksheets/sheet${sheetId}.xml: <sheetViews/> element exists but it doesn't contain any <sheetView/> elements`)
							}

							const sheetViewAttributes = {
								tabSelected: sheetIndex === 0 ? 1 : 0, // The first sheet is selected by default.
								workbookViewId: 0
							}
							const sheetViewsXml =
								getOpeningTagMarkup('sheetViews') +
								getOpeningTagMarkup('sheetView', sheetViewAttributes) +
								getSelfClosingTagMarkup('pane', paneAttributes) +
								getClosingTagMarkup('sheetView', sheetViewAttributes) +
								getClosingTagMarkup('sheetViews')

							// Add a `<sheetViews/>` element with a child '<sheetView/>` element with a child `<pane/>` element.
							// For some reason, Excel 2007 demands `<sheetViews/>` element to be the first one in a `<worksheet/>` element.
							const worksheetElement = findElement(xml, 'worksheet')
							xml = prependMarkupInsideElement(xml, worksheetElement, sheetViewsXml)
						}
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
				transform: (xml, { stickyRowsCount, stickyColumnsCount }) => {
					if (stickyRowsCount || stickyColumnsCount) {
						// Find a `<workbookView/>` element.
						// It is required to exist because it is referenced as `workbookViewId="0"`
						// attribute in `<sheetViews/>` element in `xl/worksheets/sheet{id}.xml` file.
						const workbookViewElement = findElement(xml, 'workbookView')
						if (!workbookViewElement) {
							// `<workbookView/>` element doesn't exist, so it should be created.
							// The parent element for it should be `<bookViews/>`.
							const bookViewsElement = findElement(xml, 'bookViews')
							if (bookViewsElement) {
								throw new Error(`xl/workbook.xml: <bookViews/> element exists but it doesn't contain any <workbookView/> elements`)
							}
							// Add a `<bookViews/>` element with a child '<workbookView/>` element.
							// For some reason, Excel 2007 demands `<bookViews/>` element to go before `<sheets/>` element.
							// And `<sheets/>` element always exists.
							xml = xml.replace('<sheets>', '<bookViews><workbookView/></bookViews>' + '<sheets>')
						}
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