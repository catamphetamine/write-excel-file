import getAdditionalContent from '../helpers/features/getAdditionalContent.js'
import transformContent from '../helpers/features/transformContent.js'

import $attributeValue from '../../xml/escapeAttributeValue.js'

export default function generateWorkbookXml({
	sheetIdsAndNames,
	multipleSheetsParameters,
	features,
	...restParameters
}) {
	let xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
		'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main">' +
			// `<workbookPr/>` element must be the first one.
			// Otherwise Excel 2007 would consider the spreadsheet to be corrupt.
			'<workbookPr/>' +
			// `<bookViews/>` element must be placed after `<workbookPr/>` element.
			// Otherwise Excel 2007 would consider the spreadsheet to be corrupt.
			'<bookViews>' +
				'<workbookView/>' +
			'</bookViews>' +
			// `<sheets/>` element must be placed after `<bookViews/>` element.
			// Otherwise Excel 2007 would consider the spreadsheet to be corrupt.
			'<sheets>' +
				sheetIdsAndNames.map(({ sheetId, sheetName }) => `<sheet name="${$attributeValue(sheetName)}" sheetId="${sheetId}" r:id="rId${sheetId}"/>`).join('') +
			'</sheets>' +
			'<definedNames/>' +
			'<calcPr/>' +
			// Apply any plugins that insert additional content to this XML.
			getAdditionalContent(
				'xl/workbook.xml',
				features,
				restParameters,
				{ multipleSheetsParameters }
			) +
		'</workbook>'

		// Apply any plugins that transform this XML.
		xml = transformContent(
			xml,
			'xl/workbook.xml',
			features,
			restParameters,
			{ multipleSheetsParameters }
		)

		return xml
}