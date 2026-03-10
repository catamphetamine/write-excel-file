import getSelfClosingTagMarkup from '../../../xml/getSelfClosingTagMarkup.js'

export default function generateViews({
	sheetIndex,
	...viewProperties
}) {
	if (!hasView(viewProperties)) {
		return ''
	}

	const {
		showGridLines,
		rightToLeft,
		zoomScale
	} = viewProperties

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
	views += getSelfClosingTagMarkup('sheetView', sheetViewAttributes)
	views += '</sheetViews>'

	return views
}

function hasView({
	showGridLines,
	rightToLeft,
	zoomScale
}) {
	return showGridLines === false ||
		rightToLeft ||
		typeof zoomScale === 'number'
}