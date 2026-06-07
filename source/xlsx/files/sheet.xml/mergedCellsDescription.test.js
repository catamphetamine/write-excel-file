import { describe, it } from 'mocha'
import { expect } from 'chai'

import getElementXml from '../../helpers/features/getElementXml.js'

import generateMergedCellsDescription from './mergedCellsDescription.js'
import processMergedCells from './processMergedCells.js'

describe('generateMergedCellsDescription()', () => {
  it('should generate merged cells with `span` property (legacy property name)', () => {
    const data = [
      [
        { value: '1', span: 3 },
        undefined,
        null
      ]
    ]

    const { mergedCells } = processMergedCells(data, { features: [] })

    expect(generateMergedCellsDescription(tag, mergedCells))
      .to.equal('<mergeCells count="1"><mergeCell ref="A1:C1"/></mergeCells>')
  })

  it('should generate merged cells with `columnSpan` property', () => {
    const data = [
      [
        { value: '1', columnSpan: 3 },
        undefined,
        null
      ]
    ]

    const { mergedCells } = processMergedCells(data, { features: [] })

    expect(generateMergedCellsDescription(tag, mergedCells))
      .to.equal('<mergeCells count="1"><mergeCell ref="A1:C1"/></mergeCells>')
  })

  it('should generate merged cells with both `columnSpan` and `rowSpan`', () => {
    const data = [
      [
        { value: '1.1' },
        { value: '1.2' },
        { value: '1.3' }
      ],
      [
        { value: '2.1', columnSpan: 3, rowSpan: 2 },
        null,
        null
      ],
      [
        null,
        null,
        null
      ]
    ]

    const { mergedCells } = processMergedCells(data, { features: [] })

    expect(generateMergedCellsDescription(tag, mergedCells))
      .to.equal('<mergeCells count="1"><mergeCell ref="A2:C3"/></mergeCells>')
  })
})

function tag(tagName, attributes, innerXml) {
  return getElementXml('xl/worksheets/sheet{id}.xml', tagName, attributes, innerXml, 0, {}, {}, [])
}