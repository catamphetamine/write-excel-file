import generateRows from './rows'

import SharedStrings from './sharedStrings'

describe('generateRows()', () => {
  it('should generate rows', () => {
    expect(generateRows([[{
      value: 'Test',
      type: String
    }, {
      value: 1000,
      type: Number
    }]], {
    	sharedStrings: new SharedStrings()
    })).to.equal(
    	// '<row r="1"><c r="A1" t="inlineStr"><is><t>Test</t></is></c><c r="B1"><v>1000</v></c></row>'
    	'<row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1"><v>1000</v></c></row>'
    )
  })
})