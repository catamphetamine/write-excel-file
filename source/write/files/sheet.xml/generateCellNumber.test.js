// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/__test__/commons/generateCellNumber.spec.js

import generateCellNumber from './generateCellNumber.js'

describe('generateCellNumber()', () => {
  it('should create cell number A1', () => {
    expect(generateCellNumber(0, 1)).to.equal('A1')
  })

  it('should create cell number AD3', () => {
    expect(generateCellNumber(29, 3)).to.equal('AD3')
  })

  it('should create cell number BAR7', () => {
    expect(generateCellNumber(1395, 7)).to.equal('BAR7')
  })

  it('should create cell number FOOBAR44', () => {
    expect(generateCellNumber(78407931, 44)).to.equal('FOOBAR44')
  })
})