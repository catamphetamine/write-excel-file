import generateMergedCellsDescription from './generateMergedCellsDescription.js'

describe('generateMergedCellsDescription()', () => {
  it('should generate merged cells across columns', () => {
    expect(generateMergedCellsDescription([
      [
        { value: '1', span: 3 },
        { value: '2' },
        { value: '3' }
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
        { value: '2.2' },
        { value: '2.3' }
      ],
      [
        { value: '3.1' },
        { value: '3.2' },
        { value: '3.3' }
      ]
    ], { schema: undefined }))
      .to.equal('<mergeCells count="1"><mergeCell ref="A2:C3"/></mergeCells>')
  })
})