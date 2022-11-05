// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/zipcelx.js
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/templates/worksheet.xml.js

import generateRows from './rows.js'
import generateColumnsDescription from './columns.js'
import processMergedCells from './processMergedCells.js'
import generateMergedCellsDescription from './generateMergedCellsDescription.js'
import generateLayout from './layout.js'
import generateViews from './views.js'

// const WORKSHEET_TEMPLATE = `<?xml version="1.0" ?>
// <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main"><sheetData>{data}</sheetData></worksheet>`;

const WORKSHEET_TEMPLATE = `<?xml version="1.0" ?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main">{views}{columnsDescription}<sheetData>{data}</sheetData>{mergedCellsDescription}{layout}</worksheet>`;

export default function generateWorksheet(data_, {
	schema,
	columns,
	headerStyle,
	getStyle,
	getSharedString,
	customFont,
	dateFormat,
	orientation,
	stickyRowsCount,
	stickyColumnsCount,
	sheetId
}) {
	validateData(data_, { schema })

	const { data, mergedCells } = processMergedCells(data_, { schema })

  return WORKSHEET_TEMPLATE
  	.replace('{data}', generateRows(data, {
  		schema,
  		headerStyle,
  		getStyle,
  		getSharedString,
  		customFont,
  		dateFormat
  	}))
  	.replace('{views}', generateViews({ stickyRowsCount, stickyColumnsCount }))
  	.replace('{columnsDescription}', generateColumnsDescription({ schema, columns }))
  	.replace('{mergedCellsDescription}', generateMergedCellsDescription(mergedCells))
  	.replace('{layout}', generateLayout({ sheetId, orientation }))
}

function validateData(data, { schema }) {
	if (schema) {
		if (!Array.isArray(data)) {
			throw new TypeError('Expected an array of objects')
		}
	} else {
		if (!Array.isArray(data)) {
			throw new TypeError('Expected an array of arrays')
		}
		if (data.length > 0) {
			if (!Array.isArray(data[0])) {
				throw new TypeError('Expected an array of arrays')
			}
		}
	}
}