import generateCellNumber from './helpers/generateCellNumber.js'
import getAttributesString from '../../../xml/getAttributesString.js'

export default function generateViews({
	stickyRowsCount,
	stickyColumnsCount,
	showGridLines,
	rightToLeft
}) {
	if (!stickyRowsCount && !stickyColumnsCount && !(showGridLines === false) && !rightToLeft) {
		return ''
	}

	let views = ''

	const sheetViewAttributes = {
		tabSelected: 1,
		workbookViewId: 0
	}

	if (showGridLines === false) {
		sheetViewAttributes.showGridLines = false
	}

	if (rightToLeft) {
		sheetViewAttributes.rightToLeft = 1
	}

	const paneAttributes = {
		ySplit: stickyRowsCount || 0,
		xSplit: stickyColumnsCount || 0,
		topLeftCell: generateCellNumber((stickyColumnsCount || 0), (stickyRowsCount || 0) + 1),
		activePane: 'bottomRight',
		state: 'frozen'
	}

	views += '<sheetViews>'
	views += `<sheetView${getAttributesString(sheetViewAttributes)}>`
	views += `<pane${getAttributesString(paneAttributes)}/>`
	views += '</sheetView>'
	views += '</sheetViews>'

	return views
}