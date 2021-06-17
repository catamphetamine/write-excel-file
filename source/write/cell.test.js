// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/__test__/formatters/cells/formatCell.spec.js

import generateCell from './cell'

import Integer from '../types/Integer'
import Email from '../types/Email'
import URL from '../types/URL'

import SharedStrings from './sharedStrings'

describe('generateCell()', () => {
  describe('Create a cell of type Sting', () => {
    it('should throw if invalid type was supplied', () => {
      expect(() => generateCell(1, 0, 'Test', 'Unsupported'))
        .to.throw('Unknown schema type: Unsupported')
    })

    it('should create a cell', () => {
      const sharedStrings = new SharedStrings()
      expect(generateCell(1, 0, 'Test', String, undefined, sharedStrings)).to.equal(
        // '<c r="A1" t="inlineStr"><is><t>Test</t></is></c>'
        '<c r="A1" t="s"><v>0</v></c>'
      )
      expect(sharedStrings.sharedStrings).to.deep.equal(['Test'])
    })
  })

  describe('Create a cell of type Number', () => {
    it('should create a cell', () => {
      expect(generateCell(1, 1, 1000, Number)).to.equal('<c r="B1"><v>1000</v></c>')
    })
    it('should create a cell with a cell style ID', () => {
      expect(generateCell(1, 1, 1000, Number, 123)).to.equal('<c r="B1" s="123"><v>1000</v></c>')
    })
  })

  describe('Create a cell of type Integer', () => {
    it('Create a cell', () => {
      expect(generateCell(1, 1, 1000, Integer)).to.equal('<c r="B1"><v>1000</v></c>')
    })
  })

  describe('Create a cell of type URL', () => {
    it('should create a cell', () => {
      const sharedStrings = new SharedStrings()
      expect(generateCell(1, 1, 'https://google.com', URL, undefined, sharedStrings))
        // .to.equal('<c r="B1" t="inlineStr"><is><t>https://google.com</t></is></c>')
        .to.equal('<c r="B1" t="s"><v>0</v></c>')
    })
  })

  describe('Create a cell of type Email', () => {
    it('should create a cell', () => {
      const sharedStrings = new SharedStrings()
      expect(generateCell(1, 1, 'example@domain.com', Email, undefined, sharedStrings))
        // .to.equal('<c r="B1" t="inlineStr"><is><t>example@domain.com</t></is></c>')
        .to.equal('<c r="B1" t="s"><v>0</v></c>')
    })
  })

  describe('Create a cell of type Date', () => {
    it('should throw if no date format was supplied', () => {
      expect(() => generateCell(1, 0, new Date(2020, 11, 30), Date))
        .to.throw('No "format"')
    })

    it('should create a cell', () => {
      const sharedStrings = new SharedStrings()
      expect(generateCell(1, 0, new Date(2020, 11, 30), Date, 123))
        // .to.equal('<c r="B1" t="inlineStr"><is><t>example@domain.com</t></is></c>')
        .to.equal('<c r="A1" s="123"><v>44194.875</v></c>')
    })
  })
})