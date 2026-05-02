import { describe, it } from 'mocha'
import { expect } from 'chai'

import getOrderOfSiblings from './getOrderOfSiblings.js'

describe('getOrderOfSiblings()', () => {
	it('should return order of siblings', () => {
		expect(getOrderOfSiblings('xl/worksheets/sheet{id}.xml', 'worksheet')).to.include('sheetViews')
		expect(getOrderOfSiblings('xl/worksheets/sheet{id}.xml', 'elementNotExists')).to.be.undefined
		expect(getOrderOfSiblings('fileNotExists.xml', 'tagName')).to.be.undefined
	})
})