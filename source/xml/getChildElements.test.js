import { describe, it } from 'mocha'
import { expect } from 'chai'

import findElement from './findElement.js'
import getChildElements from './getChildElements.js'

describe('utility/getChildElements', () => {
	it('should get child elements', () => {
		const xml = '<a><b x="x"><c y="y" z="z">d<a>a</a><b>b</b></c><d/></b><b/></a>'
		expect(
			getChildElements(xml, findElement(xml, 'b'))
		).to.deep.equal([{
			tagName: 'c',
			openingTagAttributes: {
				y: 'y',
				z: 'z'
			},
			openingTagStartIndex: 12,
			openingTagEndIndex: 26,
			selfClosingTag: false,
			closingTagStartIndex: 44,
			closingTagEndIndex: 47
		}, {
			tagName: 'd',
			openingTagAttributes: {},
			openingTagStartIndex: 48,
			openingTagEndIndex: 51,
			selfClosingTag: true,
			closingTagStartIndex: undefined,
			closingTagEndIndex: undefined
		}])
	})
})