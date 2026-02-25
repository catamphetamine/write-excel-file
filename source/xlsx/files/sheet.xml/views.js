import getAttributesString from '../../../xml/getAttributesString.js'

export default function generateViews({
	showGridLines,
	rightToLeft,
	zoomScale,
	sheetIndex
}) {
	// Custom "plug-ins" might modify the `<views/>` element contents.
	// Because of that, `<views/>` element is always created.
	//
	// if (
	// 	!stickyRowsCount &&
	// 	!stickyColumnsCount &&
	// 	!(showGridLines === false) &&
	// 	!rightToLeft &&
	//  typeof zoomScale !== 'number'
	// ) {
	// 	return ''
	// }

	let views = ''

	const sheetViewAttributes = {
		tabSelected: sheetIndex === 0 ? 1 : 0, // The first sheet is selected by default.
		workbookViewId: 0
	}

	if (showGridLines === false) {
		sheetViewAttributes.showGridLines = false
	}

	if (rightToLeft) {
		sheetViewAttributes.rightToLeft = 1
	}

	if (typeof zoomScale === 'number') {
		// Convert the scale number to a percentage.
		//
		// Excel 2007 doesn't like fractional `zoomScale` percentage values.
		// To work around that, it rounds the resulting percentage value.
		//
		sheetViewAttributes.zoomScale = Math.round(zoomScale * 100)
	}

	views += '<sheetViews>'
	views += `<sheetView${getAttributesString(sheetViewAttributes)}>`
	views += '</sheetView>'
	views += '</sheetViews>'

	return views
}