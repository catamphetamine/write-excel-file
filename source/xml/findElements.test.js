import { describe, it } from 'mocha'
import { expect } from 'chai'

import findElements from './findElements.js'

describe('utility/findElements', () => {
	it('should find elements', () => {
		expect(
			findElements('<a><b x="y" z="z"><c>d</c></b><b/></a>', 'b')
		).to.deep.equal([{
			tagName: 'b',
			openingTagAttributes: {
				x: 'y',
				z: 'z'
			},
			openingTagStartIndex: 3,
			openingTagEndIndex: 17,
			selfClosingTag: false,
			closingTagStartIndex: 26,
			closingTagEndIndex: 29
		}, {
			tagName: 'b',
			openingTagAttributes: {},
			openingTagStartIndex: 30,
			openingTagEndIndex: 33,
			selfClosingTag: true,
			closingTagStartIndex: undefined,
			closingTagEndIndex: undefined
		}])
	})
})