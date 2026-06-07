import generateSheetViews from './sheetViews.js'
import generateColumnsDescription from './columns.js'
import generateSheetData from './sheetData.js'
import processMergedCells from './processMergedCells.js'
import generateMergedCellsDescription from './mergedCellsDescription.js'
import generatePageMargins from './pageMargins.js'
import generatePageSetup from './pageSetup.js'
import generateDrawingReference from './drawingReference.js'

import getAdditionalContent from '../../helpers/features/getAdditionalContent.js'
import transformContent from '../../helpers/features/transformContent.js'

import getElementXml from '../../helpers/features/getElementXml.js'

export default function generateSheetXml(sheetXmlParameters, features) {
	const {
		sheetData: sheetData_,
		sheetOptions,
		sheetIndex,
		sheetId,
		hasDefaultFont,
		findOrCreateCellStyle,
		findOrCreateSharedString
	} = sheetXmlParameters

	const {
		columns,
		dateFormat,
		orientation,
		showGridLines,
		rightToLeft,
		zoomScale
	} = sheetOptions

	const { sheetData, mergedCells } = processMergedCells(sheetData_, { features })

	// A parameter that will be used inside the `tag()` function below.
	const tagFunctionProperties = {
		sheetIndex,
		sheetId
	}

	/**
	 * Creates XML tag markup.
	 * @param {string} tagName
	 * @param {object} attributes
	 * @param {string} [innerXml]
	 * @param {number} [index]
	 * @returns {string}
	 */
	const tag = (tagName, attributes, innerXml, index) => {
		return getElementXml('xl/worksheets/sheet{id}.xml', tagName, attributes, innerXml, index, tagFunctionProperties, sheetOptions, features)
	}

  let xml = '<?xml version="1.0" ?>' +
		'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main">' +
			// The order of elements is dictated by the XLSX spec.
			//
			// `<sheetViews/>`
			generateSheetViews(tag, {
				showGridLines,
				rightToLeft,
				zoomScale
			}, sheetIndex) +
			// `<cols/>`
			generateColumnsDescription(tag, columns) +
			// `<sheetData/>`
			generateSheetData(tag, sheetData, {
				findOrCreateCellStyle,
				findOrCreateSharedString,
				hasDefaultFont,
				dateFormat,
				features
			}) +
			// `<mergeCells/>`
			generateMergedCellsDescription(tag, mergedCells) +
			// `<pageMargins/>`
			generatePageMargins(tag, { orientation }) +
			// `<pageSetup/>`
			generatePageSetup(tag, { orientation }) +
			// `<drawing/>`
			generateDrawingReference(tag) +
			// Apply any plugins that insert additional content to this XML.
			getAdditionalContent(
				'xl/worksheets/sheet{id}.xml',
				features,
				sheetOptions,
				{ sheetIndex, sheetId }
			) +
		'</worksheet>'

	// Apply any plugins that transform this XML.
	xml = transformContent(
		xml,
		'xl/worksheets/sheet{id}.xml',
		features,
		sheetOptions,
		{ sheetIndex, sheetId }
	)

	return xml
}