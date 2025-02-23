import generateMergedCellsDescription from './generateMergedCellsDescription.js'
import processMergedCells from './processMergedCells.js'

describe('generateMergedCellsDescription()', () => {
  it('should generate merged cells across columns', () => {
    const data = [
      [
        { value: '1', span: 3 },
        undefined,
        null
      ]
    ]

    const { mergedCells } = processMergedCells(data, { schema: undefined })

    expect(generateMergedCellsDescription(mergedCells))
      .to.equal('<mergeCells count="1"><mergeCell ref="A1:C1"/></mergeCells>')
  })

  it('should generate merged cells across columns and rows', () => {
    const data = [
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
    ]

    const { mergedCells } = processMergedCells(data, { schema: undefined })

    expect(generateMergedCellsDescription(mergedCells))
      .to.equal('<mergeCells count="1"><mergeCell ref="A2:C3"/></mergeCells>')
  })
})