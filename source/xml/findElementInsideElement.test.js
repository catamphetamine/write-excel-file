import { describe, it } from 'mocha'
import { expect } from 'chai'

import findElement from './findElement.js'
import findElementInsideElement from './findElementInsideElement.js'

describe('utility/findElementInsideElement', () => {
	it('should find element inside another element', () => {
		const b = findElement('<a><b x="y" z="z"><c>d</c></b><b/></a>', 'b')
		expect(
			findElementInsideElement('<a><b x="y" z="z"><c>d</c></b><b/></a>', 'c', b)
		).to.deep.equal({
			tagName: 'c',
			openingTagAttributes: {},
			openingTagStartIndex: 18,
			openingTagEndIndex: 20,
			selfClosingTag: false,
			closingTagStartIndex: 22,
			closingTagEndIndex: 25
		})
	})
})