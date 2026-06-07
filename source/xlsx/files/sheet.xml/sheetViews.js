import getSelfClosingTagMarkup from '../../../xml/getSelfClosingTagMarkup.js'

export default function generateSheetViews(
	tag,
	viewProperties,
	sheetIndex
) {
	if (!hasView(viewProperties)) {
		return ''
	}

	const {
		showGridLines,
		rightToLeft,
		zoomScale
	} = viewProperties

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

	const sheetViewXml = tag('sheetView', sheetViewAttributes, null, 0)

	return tag('sheetViews', null, sheetViewXml)
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