// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/formatters/cols/formatCols.spec.js

import generateColumnDescription from './column.js'

describe('generateColumnDescription()', () => {
  it('Should generate column description', () => {
		// `150px` turns into `25` excel points according to the formulas in Microsoft docs.
		// (see "Column Width" chapter)
		// https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.spreadsheet.column.aspx
    expect(generateColumnDescription({ width: 25 }, 0)).to.equal(
    	'<col min="1" max="1" width="25" customWidth="1"/>'
    )
  })
})