import { describe, it } from 'mocha'
import { expect } from 'chai'

import generateRows from './rows.js'

describe('generateRows()', () => {
  it('should generate rows', () => {
    expect(generateRows([[{
      value: 'Test',
      type: String
    }, {
      value: 1000,
      type: Number
    }]], {
      findOrCreateSharedString(string) {
        return 0
      },
      features: []
    })).to.equal(
    	// '<row r="1"><c r="A1" t="inlineStr"><is><t>Test</t></is></c><c r="B1"><v>1000</v></c></row>'
    	'<row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1"><v>1000</v></c></row>'
    )
  })
})