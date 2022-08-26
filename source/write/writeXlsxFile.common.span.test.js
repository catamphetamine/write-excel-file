import { generateSheets } from './writeXlsxFile.common.js'

describe('generateSheets()', () => {
  it('should detect `span`/`rowSpan` overlap', function() {
    expect(
      () => generateSheets({
        data: [
          [
            {
              value: 'Text',
              span: 3
            },
            null,
            {
              value: 'Text'
            }
          ]
        ]
      })
    ).to.throw('span')
  })
})
