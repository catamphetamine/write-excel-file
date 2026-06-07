import { describe, it } from 'mocha'
import { expect } from 'chai'

import getElementXml from '../../helpers/features/getElementXml.js'

import generateColumnDescription from './column.js'

describe('generateColumnDescription()', () => {
  it('Should generate column description', () => {
		// `150px` turns into `25` excel points according to the formulas in Microsoft docs.
		// (see "Column Width" chapter)
		// https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.spreadsheet.column.aspx
    expect(generateColumnDescription(tag, { width: 25 }, 0)).to.equal(
    	'<col min="1" max="1" width="25" customWidth="1"/>'
    )
  })
})

function tag(tagName, attributes, innerXml) {
	return getElementXml('xl/worksheets/sheet{id}.xml', tagName, attributes, innerXml, 0, {}, {}, [])
}