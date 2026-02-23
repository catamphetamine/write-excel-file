import writeXlsxFileBrowser from '../browser/index.js'
import writeXlsxFileBrowserCommonJs from '../browser/index.cjs'

import writeXlsxFileUniversal from '../universal/index.js'
import writeXlsxFileUniversalCommonJs from '../universal/index.cjs'

import writeXlsxFileNode from '../node/index.js'
import writeXlsxFileNodeCommonJs from '../node/index.cjs'

describe('/browser', () => {
	it('should export ESM', () => {
		expect(writeXlsxFileBrowser).to.be.a('function')
	})

	it(`should export CommonJS`, () => {
		expect(writeXlsxFileBrowserCommonJs).to.be.a('function')
	})
})

describe('/node', () => {
	it('should export ESM', () => {
		expect(writeXlsxFileNode).to.be.a('function')
	})

	it(`should export CommonJS`, () => {
		expect(writeXlsxFileNodeCommonJs).to.be.a('function')
	})
})

describe('/universal', () => {
	it('should export ESM', () => {
		expect(writeXlsxFileUniversal).to.be.a('function')
	})

	it(`should export CommonJS`, () => {
		expect(writeXlsxFileUniversalCommonJs).to.be.a('function')
	})
})