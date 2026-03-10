import { describe, it } from 'mocha'
import { expect } from 'chai'

import {
	findElement,
	findElements,
	getOpeningTagMarkup,
	getClosingTagMarkup,
	getSelfClosingTagMarkup,
	replaceElement,
	getMarkupInsideElement,
	setMarkupInsideElement,
	prependMarkupInsideElement,
	appendMarkupInsideElement,
	escapeAttributeName,
	escapeAttributeValue,
	escapeTextContent
} from '../../utility/index.js'

import CommonJs from '../../utility/index.cjs'

describe('/utility', () => {
	it('should export ESM', () => {
		expect(findElement).to.be.a('function')
		expect(findElements).to.be.a('function')
		expect(getOpeningTagMarkup).to.be.a('function')
		expect(getClosingTagMarkup).to.be.a('function')
		expect(getSelfClosingTagMarkup).to.be.a('function')
		expect(replaceElement).to.be.a('function')
		expect(getMarkupInsideElement).to.be.a('function')
		expect(setMarkupInsideElement).to.be.a('function')
		expect(prependMarkupInsideElement).to.be.a('function')
		expect(appendMarkupInsideElement).to.be.a('function')
		expect(escapeAttributeName).to.be.a('function')
		expect(escapeAttributeValue).to.be.a('function')
		expect(escapeTextContent).to.be.a('function')
	})

	it(`should export CommonJS`, () => {
		expect(CommonJs.findElement).to.be.a('function')
		expect(CommonJs.findElements).to.be.a('function')
		expect(CommonJs.getOpeningTagMarkup).to.be.a('function')
		expect(CommonJs.getClosingTagMarkup).to.be.a('function')
		expect(CommonJs.getSelfClosingTagMarkup).to.be.a('function')
		expect(CommonJs.replaceElement).to.be.a('function')
		expect(CommonJs.getMarkupInsideElement).to.be.a('function')
		expect(CommonJs.setMarkupInsideElement).to.be.a('function')
		expect(CommonJs.prependMarkupInsideElement).to.be.a('function')
		expect(CommonJs.appendMarkupInsideElement).to.be.a('function')
		expect(CommonJs.escapeAttributeName).to.be.a('function')
		expect(CommonJs.escapeAttributeValue).to.be.a('function')
		expect(CommonJs.escapeTextContent).to.be.a('function')
	})
})