import { describe, it } from 'mocha'
import { expect } from 'chai'

import {
	findElement,
	findElementInsideElement,
	getChildElements,
	getOpeningTagMarkup,
	getClosingTagMarkup,
	getSelfClosingTagMarkup,
	insertElementMarkupAccordingToOrderOfSiblings,
	getOrderOfSiblings,
	replaceElement,
	getMarkupInsideElement,
	setMarkupInsideElement,
	prependMarkupInsideElement,
	appendMarkupInsideElement,
	sanitizeAttributeName,
	sanitizeAttributeValue,
	sanitizeTextContent,
	getCellAddress,
	convertDateToSerialNumber,
	// Deprecated exports.
	escapeAttributeName,
	escapeAttributeValue,
	escapeTextContent
} from '../../utility/index.js'

import CommonJs from '../../utility/index.cjs'

describe('/utility', () => {
	it('should export ESM', () => {
		expect(findElement).to.be.a('function')
		expect(findElementInsideElement).to.be.a('function')
		expect(getChildElements).to.be.a('function')
		expect(getOpeningTagMarkup).to.be.a('function')
		expect(getClosingTagMarkup).to.be.a('function')
		expect(getSelfClosingTagMarkup).to.be.a('function')
		expect(insertElementMarkupAccordingToOrderOfSiblings).to.be.a('function')
		expect(getOrderOfSiblings).to.be.a('function')
		expect(replaceElement).to.be.a('function')
		expect(getMarkupInsideElement).to.be.a('function')
		expect(setMarkupInsideElement).to.be.a('function')
		expect(prependMarkupInsideElement).to.be.a('function')
		expect(appendMarkupInsideElement).to.be.a('function')
		expect(sanitizeAttributeName).to.be.a('function')
		expect(sanitizeAttributeValue).to.be.a('function')
		expect(sanitizeTextContent).to.be.a('function')
		expect(getCellAddress).to.be.a('function')
		expect(convertDateToSerialNumber).to.be.a('function')
		// Deprecated exports.
		expect(escapeAttributeName).to.be.a('function')
		expect(escapeAttributeValue).to.be.a('function')
		expect(escapeTextContent).to.be.a('function')
	})

	it(`should export CommonJS`, () => {
		expect(CommonJs.findElement).to.be.a('function')
		expect(CommonJs.findElementInsideElement).to.be.a('function')
		expect(CommonJs.getChildElements).to.be.a('function')
		expect(CommonJs.getOpeningTagMarkup).to.be.a('function')
		expect(CommonJs.getClosingTagMarkup).to.be.a('function')
		expect(CommonJs.getSelfClosingTagMarkup).to.be.a('function')
		expect(CommonJs.insertElementMarkupAccordingToOrderOfSiblings).to.be.a('function')
		expect(CommonJs.getOrderOfSiblings).to.be.a('function')
		expect(CommonJs.replaceElement).to.be.a('function')
		expect(CommonJs.getMarkupInsideElement).to.be.a('function')
		expect(CommonJs.setMarkupInsideElement).to.be.a('function')
		expect(CommonJs.prependMarkupInsideElement).to.be.a('function')
		expect(CommonJs.appendMarkupInsideElement).to.be.a('function')
		expect(CommonJs.sanitizeAttributeName).to.be.a('function')
		expect(CommonJs.sanitizeAttributeValue).to.be.a('function')
		expect(CommonJs.sanitizeTextContent).to.be.a('function')
		expect(CommonJs.getCellAddress).to.be.a('function')
		expect(CommonJs.convertDateToSerialNumber).to.be.a('function')
		// Deprecated exports
		expect(CommonJs.escapeAttributeName).to.be.a('function')
		expect(CommonJs.escapeAttributeValue).to.be.a('function')
		expect(CommonJs.escapeTextContent).to.be.a('function')
	})
})