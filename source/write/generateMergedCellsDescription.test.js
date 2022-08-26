import generateMergedCellsDescription from './generateMergedCellsDescription.js'

describe('generateMergedCellsDescription()', () => {
  it('should generate merged cells across columns', () => {
    expect(generateMergedCellsDescription([
      [
        { value: '1', span: 3 },
        undefined,
        null
      ]
    ], { schema: undefined }))
      .to.equal('<mergeCells count="1"><mergeCell ref="A1:C1"/></mergeCells>')
  })

  it('should generate merged cells across columns and rows', () => {
    expect(generateMergedCellsDescription([
      [
        { value: '1.1' },
        { value: '1.2' },
        { value: '1.3' }
      ],
      [
        { value: '2.1', span: 3, rowSpan: 2 },
        null,
        null
      ],
      [
        null,
        null,
        null
      ]
    ], { schema: undefined }))
      .to.equal('<mergeCells count="1"><mergeCell ref="A2:C3"/></mergeCells>')
  })

  it('should validate overlapping cells when using `span`', () => {
    expect(() => generateMergedCellsDescription([
      [
        { value: '1', span: 3 },
        { value: '2' },
        { value: '3' }
      ]
    ], { schema: undefined }))
      .to.throw('Cell at row 1 and column 2')
  })

  it('should validate overlapping cells when using `rowSpan`', () => {
    expect(() => generateMergedCellsDescription([
      [
        { value: '1.1', rowSpan: 2 },
        { value: '1.2' }
      ],
      [
        { value: '2.1' },
        { value: '2.2' }
      ]
    ], { schema: undefined }))
      .to.throw('Cell at row 2 and column 1')
  })

  it('should validate overlapping cells when using `span` and `rowSpan`', () => {
    expect(() => generateMergedCellsDescription([
      [
        { value: '1.1' },
        { value: '1.2' },
        { value: '1.3' }
      ],
      [
        { value: '2.1', span: 3, rowSpan: 2 },
        { value: '2.2' },
        { value: '2.3' }
      ],
      [
        { value: '3.1' },
        { value: '3.2' },
        { value: '3.3' }
      ]
    ], { schema: undefined }))
      .to.throw('Cell at row 2 and column 2')

    expect(() => generateMergedCellsDescription([
      [
        { value: '1.1' },
        { value: '1.2' },
        { value: '1.3' }
      ],
      [
        { value: '2.1', span: 3, rowSpan: 2 },
        null,
        null
      ],
      [
        { value: '3.1' },
        { value: '3.2' },
        { value: '3.3' }
      ]
    ], { schema: undefined }))
      .to.throw('Cell at row 3 and column 1')
  })
})