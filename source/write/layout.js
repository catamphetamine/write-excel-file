import $attr from '../xml/sanitizeAttributeValue.js'

export default function generateLayout({
	sheetId,
	orientation
}) {
	let layout = ''

	// Margins are required when setting custom orientation,
	// otherwise they'd be `0`.
	// https://gitlab.com/catamphetamine/write-excel-file/-/issues/7#note_782347297
	if (orientation) {
		// Page margins (when printing).
		// https://github.com/randym/axlsx/blob/master/lib/axlsx/workbook/worksheet/page_margins.rb

		const marginLeft = 0.7 // The left margin in inches.
		const marginRight = 0.7 // The right margin in inches.
		const marginTop = 0.75 // The top margin in inches.
		const marginBottom = 0.75 // The bottom margin in inches.
		const header = 0.3 // The header margin in inches.
		const footer = 0.3 // The footer margin in inches.

		layout += '<pageMargins'
		layout += ` left="${marginLeft}"`
		layout += ` right="${marginRight}"`
		layout += ` top="${marginTop}"`
		layout += ` bottom="${marginBottom}"`
		layout += ` header="${header}"`
		layout += ` footer="${footer}"`
		layout += '/>'
	}

	// Allows setting "landscape" orientation.
	// https://gitlab.com/catamphetamine/write-excel-file/-/issues/7
	if (orientation) {
		// Paper size (when printing).
		// https://github.com/randym/axlsx/blob/master/lib/axlsx/workbook/worksheet/page_setup.rb
		//
		// `paperSize` `9` means "A4 paper (210 mm by 297 mm)".
		//
		const paperSize = 9

		// Page orientation (when printing).
		//
		// `orientation` can be:
		// * `landscape`
		// * `portrait`
		// https://docs.microsoft.com/en-us/office/vba/api/excel.pagesetup.orientation

		layout += '<pageSetup'
		layout += ` paperSize="${paperSize}"`
		layout += ` orientation="${$attr(orientation)}"`
		layout += ` r:id="rId${sheetId}"`
		layout += '/>'
	}

	return layout
}