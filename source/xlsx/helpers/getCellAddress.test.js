import { describe, it } from 'mocha'
import { expect } from 'chai'

import getCellAddress from './getCellAddress.js'

describe('getCellAddress()', () => {
  it('should create cell address A1 (row 1, column 1)', () => {
    expect(getCellAddress(0, 0)).to.equal('A1')
  })

  it('should create cell address AD3 (row 3, column 30)', () => {
    expect(getCellAddress(2, 29)).to.equal('AD3')
  })

  it('should create cell address BAR7 (row 7, column 1396)', () => {
    expect(getCellAddress(6, 1395)).to.equal('BAR7')
  })

  it('should create cell address FOOBAR44 (row 44, column 78407932)', () => {
    expect(getCellAddress(43, 78407931)).to.equal('FOOBAR44')
  })
})