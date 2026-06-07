import { describe, it } from 'mocha'
import { expect } from 'chai'

import convertDateToSerialNumber from './convertDateToSerialNumber.js'

describe('convertDateToSerialNumber()', () => {
	it('should convert a Date to an XLSX serial number', () => {
		// https://mcronberg.github.io/serialdate/
		expect(convertDateToSerialNumber(new Date('2000-01-01'))).to.equal(36526)
	})
})