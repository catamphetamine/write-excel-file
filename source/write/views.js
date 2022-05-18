import generateCellNumber from './generateCellNumber.js'

export default function generateViews({ stickyRowsCount, stickyColumnsCount }) {
	if (!stickyRowsCount && !stickyColumnsCount) {
		return ''
	}

	let views = ''

	views += '<sheetViews>'
	views += '<sheetView tabSelected="1" workbookViewId="0">'
	views += `<pane ySplit="${stickyRowsCount || 0}" xSplit="${stickyColumnsCount || 0}" topLeftCell="${generateCellNumber((stickyColumnsCount || 0), (stickyRowsCount || 0) + 1)}" activePane="bottomRight" state="frozen"/>`
	views += '</sheetView>'
	views += '</sheetViews>'

	return views
}