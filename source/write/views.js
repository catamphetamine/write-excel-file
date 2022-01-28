import generateCellNumber from './generateCellNumber'

export default function generateViews({ stickyRowsCount }) {
	if (!stickyRowsCount) {
		return ''
	}

	let views = ''

	views += '<sheetViews>'
	views += '<sheetView tabSelected="1" workbookViewId="0">'
	views += `<pane ySplit="${stickyRowsCount}" topLeftCell="${generateCellNumber(0, stickyRowsCount + 1)}" activePane="bottomRight" state="frozen"/>`
	views += '</sheetView>'
	views += '</sheetViews>'

	return views
}