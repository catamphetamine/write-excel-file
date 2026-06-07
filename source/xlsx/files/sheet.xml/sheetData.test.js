import { describe, it } from 'mocha'
import { expect } from 'chai'

import getElementXml from '../../helpers/features/getElementXml.js'

import sheetData from './sheetData.js'

describe('sheet.xml/sheetData', () => {
  it('should generate rows', () => {
    expect(sheetData(
      tag,
      [[{
        value: 'Test',
        type: String
      }, {
        value: 1000,
        type: Number
      }]],
      {
        findOrCreateSharedString(string) {
          return 0
        }
      },
      {
        sheetIndex: 0,
        sheetId: 1,
        sheetOptions: {},
        features: []
      }
    )).to.equal(
    	'<sheetData><row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1"><v>1000</v></c></row></sheetData>'
    )
  })
})

function tag(tagName, attributes, innerXml) {
  return getElementXml('xl/worksheets/sheet{id}.xml', tagName, attributes, innerXml, 0, {}, {}, [])
}