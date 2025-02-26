import $attr from '../../xml/sanitizeAttributeValue.js'

// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/statics/workbook.xml.js

export default function generateWorkbookXml({ sheets, stickyRowsCount, stickyColumnsCount }) {
	return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
		'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main">' +
			'<workbookPr/>' +
			(stickyRowsCount || stickyColumnsCount ? '<bookViews><workbookView/></bookViews>' : '') +
			'<sheets>' +
				sheets.map(({ id, name }) => `<sheet name="${$attr(name)}" sheetId="${id}" r:id="rId${id}"/>`).join('') +
			'</sheets>' +
			'<definedNames/>' +
			'<calcPr/>' +
		'</workbook>'
}