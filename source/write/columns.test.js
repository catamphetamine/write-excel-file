import generateColumnsDescription from './columns.js'

describe('generateColumns()', () => {
  it('should generate columns description', () => {
    expect(generateColumnsDescription({
      schema: [{
        value: 'Test',
        type: String,
        width: 25
      }, {
        value: 1000,
        type: Number,
        width: 10
      }]
    })).to.equal(
    	'<cols><col min="1" max="1" width="25" customWidth="1"/><col min="2" max="2" width="10" customWidth="1"/></cols>'
    )
  })
})