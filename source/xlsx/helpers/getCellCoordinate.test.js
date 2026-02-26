import { describe, it } from 'mocha'
import { expect } from 'chai'

import getCellCoordinate from './getCellCoordinate.js'

describe('getCellCoordinate()', () => {
  it('should create cell number A1 (row 1, column 1)', () => {
    expect(getCellCoordinate(0, 0)).to.equal('A1')
  })

  it('should create cell number AD3 (row 3, column 30)', () => {
    expect(getCellCoordinate(2, 29)).to.equal('AD3')
  })

  it('should create cell number BAR7 (row 7, column 1396)', () => {
    expect(getCellCoordinate(6, 1395)).to.equal('BAR7')
  })

  it('should create cell number FOOBAR44 (row 44, column 78407932)', () => {
    expect(getCellCoordinate(43, 78407931)).to.equal('FOOBAR44')
  })
})