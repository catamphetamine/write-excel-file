// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/zipcelx.js
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/templates/worksheet.xml.js

import generateRows from './rows'
import generateColumnsDescription from './columns'

// const WORKSHEET_TEMPLATE = `<?xml version="1.0" ?>
// <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main"><sheetData>{data}</sheetData></worksheet>`;

const WORKSHEET_TEMPLATE = `<?xml version="1.0" ?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main">{columnsDescription}<sheetData>{data}</sheetData></worksheet>`;

export default function generateWorksheet(data, { schema, formatStyles, sharedStrings }) {
	if (schema) {
		if (!Array.isArray(data)) {
			throw new TypeError('Expected an array of rows')
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
  return WORKSHEET_TEMPLATE
  	.replace('{data}', generateRows(data, { schema, formatStyles, sharedStrings }))
  	.replace('{columnsDescription}', generateColumnsDescription(schema))
}