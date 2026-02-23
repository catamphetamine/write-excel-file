import generateRows from './rows.js'
import generateColumnsDescription from './columns.js'
import processMergedCells from './processMergedCells.js'
import generateMergedCellsDescription from './mergedCellsDescription.js'
import generateLayout from './layout.js'
import generateViews from './views.js'
import generateDrawingReference from './drawingReference.js'

import getAdditionalContent from '../../helpers/features/getAdditionalContent.js'
import transformContent from '../../helpers/features/transformContent.js'

export default function generateSheetXml(parameters, features) {
	const {
		data: data_,
		schema,
		columns,
		images,
		getHeaderStyle,
		findOrCreateCellStyle,
		findOrCreateSharedString,
		customFont,
		dateFormat,
		orientation,
		showGridLines,
		rightToLeft,
		zoomScale,
		sheetIndex,
		sheetId,
		multipleSheetsParameters,
		...restParameters
	} = parameters

	const { data, mergedCells } = processMergedCells(data_, { schema, features })

  let xml = '<?xml version="1.0" ?>' +
		'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main">' +
			// For some weird reason, Excel 2007 demands `<sheetViews/>` element to be the first one.
			generateViews({ showGridLines, rightToLeft, zoomScale, sheetIndex }) +
			// For some weird reason, Excel 2007 demands `<cols/>` element to follow `<sheetViews/>` element.
			generateColumnsDescription({ schema, columns }) +
			'<sheetData>' +
				generateRows(data, {
					schema,
					getHeaderStyle,
					findOrCreateCellStyle,
					findOrCreateSharedString,
					customFont,
					features,
					dateFormat
				}) +
			'</sheetData>' +
			generateMergedCellsDescription(mergedCells) +
			generateLayout({ sheetId, orientation }) +
			generateDrawingReference() +
			// Apply any plugins that insert additional content to this XML.
			getAdditionalContent(
				'xl/worksheets/sheet{id}.xml',
				features,
				restParameters,
				{ multipleSheetsParameters, sheetIndex, sheetId }
			) +
		'</worksheet>'

	// Apply any plugins that transform this XML.
	xml = transformContent(
		xml,
		'xl/worksheets/sheet{id}.xml',
		features,
		restParameters,
		{ multipleSheetsParameters, sheetIndex, sheetId }
	)

	return xml
}