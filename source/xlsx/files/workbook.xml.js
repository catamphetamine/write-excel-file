import getAdditionalContent from '../helpers/features/getAdditionalContent.js'
import transformContent from '../helpers/features/transformContent.js'

import sanitizeAttributeValue from '../../xml/sanitizeAttributeValue.js'
import getElementXml from '../helpers/features/getElementXml.js'

export default function generateWorkbookXml({
	sheetIdsAndNames,
	features,
	sheetsOptions
}) {
	/**
	 * Creates XML tag markup.
	 * @param {string} tagName
	 * @param {object} attributes
	 * @param {string} [innerXml]
	 * @param {number} [index]
	 * @returns {string}
	 */
	const tag = (tagName, attributes, innerXml, index) => {
		return getElementXml('xl/workbook.xml', tagName, attributes, innerXml, index, EMPTY_OBJECT, sheetsOptions, features)
	}

	let xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
		'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main">' +
			// The order of elements is dictated by the XLSX spec.
			//
			// <workbookPr/>
			tag('workbookPr') +
			// <bookViews/>
			tag('bookViews', null, tag('workbookView', null, null, 0)) +
			// <sheets/>
			tag(
				'sheets',
				null,
				sheetIdsAndNames.map(
					({ sheetId, sheetName }, i) => {
						return tag('sheet', {
							'r:id': `rId${sheetId}`,
							sheetId,
							name: sheetName
						}, null, i)
					}
				).join('')
			) +
			// <definedNames/>
			tag('definedNames') +
			// <calcPr/>
			tag('calcPr') +
			// Apply any plugins that insert additional content to this XML.
			getAdditionalContent(
				'xl/workbook.xml',
				features,
				sheetsOptions
			) +
		'</workbook>'

		// Apply any plugins that transform this XML.
		xml = transformContent(
			xml,
			'xl/workbook.xml',
			features,
			sheetsOptions
		)

		return xml
}

const EMPTY_OBJECT = {}