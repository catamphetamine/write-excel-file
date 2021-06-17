// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/__test__/formatters/rows/formatRows.spec.js

import generateRow from './row'

import SharedStrings from './sharedStrings'

describe('generateRow()', () => {
  it('Should create one row from given data', () => {
    const sharedStrings = new SharedStrings()
    expect(generateRow(
      [
        { value: 'Test', type: String },
        { value: 1000, type: Number }
      ],
      0,
      {
        formatStyles: {},
        sharedStrings
      }
    )).to.equal(
      // '<row r="1"><c r="A1" t="inlineStr"><is><t>Test</t></is></c><c r="B1"><v>1000</v></c></row>'
    	'<row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1"><v>1000</v></c></row>'
    )
  })
})