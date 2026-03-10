import { describe, it } from 'mocha'
import { expect } from 'chai'

import findElement from './findElement.js'

describe('utility/findElement', () => {
	it('should find element', () => {
		expect(
			findElement('<a><b x="y" z="z"><c>d</c></b><b/></a>', 'b')
		).to.deep.equal({
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
		})
	})
})