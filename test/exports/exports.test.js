import { describe, it } from 'mocha'
import { expect } from 'chai'

import writeXlsxFileBrowser, { getSheetData as getSheetDataBrowser } from '../../browser/index.js'
import writeXlsxFileBrowserCommonJs, { getSheetData as getSheetDataBrowserCommonJs } from '../../browser/index.cjs'

import writeXlsxFileNode, { getSheetData as getSheetDataNode } from '../../node/index.js'
import writeXlsxFileNodeCommonJs, { getSheetData as getSheetDataNodeCommonJs } from '../../node/index.cjs'

import writeXlsxFileUniversal, { getSheetData as getSheetDataUniversal } from '../../universal/index.js'
import writeXlsxFileUniversalCommonJs, { getSheetData as getSheetDataUniversalCommonJs } from '../../universal/index.cjs'

describe('/browser', () => {
	it('should export ESM', () => {
		expect(writeXlsxFileBrowser).to.be.a('function')
		expect(getSheetDataBrowser).to.be.a('function')
	})

	it(`should export CommonJS`, () => {
		expect(writeXlsxFileBrowserCommonJs).to.be.a('function')
		expect(getSheetDataBrowserCommonJs).to.be.a('function')
	})
})

describe('/node', () => {
	it('should export ESM', () => {
		expect(writeXlsxFileNode).to.be.a('function')
		expect(getSheetDataNode).to.be.a('function')
	})

	it(`should export CommonJS`, () => {
		expect(writeXlsxFileNodeCommonJs).to.be.a('function')
		expect(getSheetDataNodeCommonJs).to.be.a('function')
	})
})

describe('/universal', () => {
	it('should export ESM', () => {
		expect(writeXlsxFileUniversal).to.be.a('function')
		expect(getSheetDataUniversal).to.be.a('function')
	})

	it(`should export CommonJS`, () => {
		expect(writeXlsxFileUniversalCommonJs).to.be.a('function')
		expect(getSheetDataUniversalCommonJs).to.be.a('function')
	})
})