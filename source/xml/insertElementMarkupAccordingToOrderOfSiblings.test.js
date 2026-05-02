import { describe, it } from 'mocha'
import { expect } from 'chai'

import insertElementMarkupAccordingToOrderOfSiblings from './insertElementMarkupAccordingToOrderOfSiblings.js'

import getOrderOfSiblings from '../xlsx/helpers/getOrderOfSiblings.js'

describe('utility/insertElementMarkupAccordingToOrderOfSiblings', () => {
	it('should insert element markup', () => {
		const xml = '<a><b x="x"><c y="y"><d z="z"></d><d></d></c><c></c></b></a>'
		expect(
			insertElementMarkupAccordingToOrderOfSiblings(xml, '<e/>', ['e', 'e1', 'e2'], 'd', 'c', 'b')
		).to.equal(
			'<a><b x="x"><c y="y"><d z="z"><e/></d><d></d></c><c></c></b></a>'
		)
	})

	it('should insert element markup (last parent is a self-closing tag)', () => {
		const xml = '<a><b x="x"><c y="y"><d z="z"/><d></d></c><c></c></b></a>'
		expect(
			insertElementMarkupAccordingToOrderOfSiblings(xml, '<e/>', ['e', 'e1', 'e2'], 'd', 'c', 'b')
		).to.equal(
			'<a><b x="x"><c y="y"><d z="z"><e/></d><d></d></c><c></c></b></a>'
		)
	})

	it('should insert element markup (specific order of elements is dictated by the `.xlsx` specification) (no "preceding" siblings are present, no "following" siblings are present)', () => {
		const xml = '<worksheet/>'
		expect(
			insertElementMarkupAccordingToOrderOfSiblings(
				xml,
				'<conditionalFormatting/>',
				getOrderOfSiblings('xl/worksheets/sheet{id}.xml', 'worksheet'),
				'worksheet'
			)
		).to.equal(
			'<worksheet><conditionalFormatting/></worksheet>'
		)
	})

	it('should insert element markup (specific order of elements is dictated by the `.xlsx` specification) ("preceding" siblings are present, no "following" siblings are present)', () => {
		const xml = '<worksheet><mergeCells/></worksheet>'
		expect(
			insertElementMarkupAccordingToOrderOfSiblings(
				xml,
				'<conditionalFormatting/>',
				getOrderOfSiblings('xl/worksheets/sheet{id}.xml', 'worksheet'),
				'worksheet'
			)
		).to.equal(
			'<worksheet><mergeCells/><conditionalFormatting/></worksheet>'
		)
	})

	// https://github.com/catamphetamine/write-excel-file/issues/12
	it('should insert element markup (specific order of elements is dictated by the `.xlsx` specification) ("preceding" siblings are present, "following" siblings are present)', () => {
		const xml = '<worksheet><mergeCells/><pageMargins/></worksheet>'
		expect(
			insertElementMarkupAccordingToOrderOfSiblings(
				xml,
				'<conditionalFormatting/>',
				getOrderOfSiblings('xl/worksheets/sheet{id}.xml', 'worksheet'),
				'worksheet'
			)
		).to.equal(
			'<worksheet><mergeCells/><conditionalFormatting/><pageMargins/></worksheet>'
		)
	})

	it('should insert element markup (specific order of elements is dictated by the `.xlsx` specification) (no "preceding" siblings are present, "following" siblings are present)', () => {
		const xml = '<worksheet><pageMargins/></worksheet>'
		expect(
			insertElementMarkupAccordingToOrderOfSiblings(
				xml,
				'<conditionalFormatting/>',
				getOrderOfSiblings('xl/worksheets/sheet{id}.xml', 'worksheet'),
				'worksheet'
			)
		).to.equal(
			'<worksheet><conditionalFormatting/><pageMargins/></worksheet>'
		)
	})
})