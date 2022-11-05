import processMergedCells from './processMergedCells.js'

describe('processMergedCells()', () => {
  it('should process merged cells across columns', () => {
    const data = [
      [
        { value: '1', span: 3 },
        undefined,
        null
      ]
    ]

    expect(processMergedCells(data, { schema: undefined }))
      .to.deep.equal({
        data,
        mergedCells: [
          [
            [0, 0],
            [0, 2]
          ]
        ]
      })
  })

  it('should process merged cells across columns and rows', () => {
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

    expect(processMergedCells(data, { schema: undefined }))
      .to.deep.equal({
        data,
        mergedCells: [
          [
            [1, 0],
            [2, 2]
          ]
        ]
      })
  })

  it('should validate overlapping cells when using `span`', () => {
    expect(() => processMergedCells([
      [
        { value: '1', span: 3 },
        { value: '2' },
        { value: '3' }
      ]
    ], { schema: undefined }))
      .to.throw('Cell at row 1 and column 2')
  })

  it('should validate overlapping cells when using `rowSpan`', () => {
    expect(() => processMergedCells([
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
    expect(() => processMergedCells([
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

    expect(() => processMergedCells([
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

  it('should copy styles to hidden cells in case of groups of merged cells', () => {
    const data = [
      [
        { value: '1', span: 3, color: '#cc0000' },
        undefined,
        null
      ]
    ]

    expect(processMergedCells(data, { schema: undefined }))
      .to.deep.equal({
        data: [
          [
            { value: '1', span: 3, color: '#cc0000' },
            { color: '#cc0000' },
            { color: '#cc0000' }
          ]
        ],
        mergedCells: [
          [
            [0, 0],
            [0, 2]
          ]
        ]
      })
  })
})