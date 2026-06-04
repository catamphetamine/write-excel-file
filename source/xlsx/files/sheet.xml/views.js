import getSelfClosingTagMarkup from '../../../xml/getSelfClosingTagMarkup.js'

export default function generateViews({
	sheetIndex,
	firstVisibleSheetIndex,
	...viewProperties
}) {
	// The first visible sheet must explicitly opt in to `tabSelected` when the
	// default (sheet 0) isn't the visible one — otherwise emit `<sheetViews/>`
	// only when there are view properties to apply.
	const isFirstVisibleSheet = sheetIndex === (firstVisibleSheetIndex || 0)
	const needsTabSelectedFallback = isFirstVisibleSheet && firstVisibleSheetIndex > 0

	if (!hasView(viewProperties) && !needsTabSelectedFallback) {
		return ''
	}

	const {
		showGridLines,
		rightToLeft,
		zoomScale
	} = viewProperties

	let views = ''

	const sheetViewAttributes = {
		tabSelected: isFirstVisibleSheet ? 1 : 0,
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