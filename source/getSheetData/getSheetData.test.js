import { describe, it } from 'mocha'
import { expect } from 'chai'

import getSheetData from './getSheetData.js'

describe('getSheetData', () => {
	it('should convert objects to sheet data', () => {
		// Data as JSON objects
		const objects = [
			{
				name: 'John Smith',
				dateOfBirth: new Date(Date.UTC(2000, 1 - 1, 5)),
				income: 120000,
				married: true
			},
			{
				name: 'Alice Brown',
				dateOfBirth: new Date(Date.UTC(2005, 4 - 1, 3)),
				income: 60000,
				married: false
			}
		]

		// A list of columns in the output sheet
		const columns = [
			{
				header: {
					value: 'Name',
					fontWeight: 'bold'
				},
				width: 20, // `width` is optional and is measured in characters
				cell: (person) => ({
					value: person.name
				})
			},
			{
				header: 'Date of Birth',
				cell: (person) => ({
					value: person.dateOfBirth,
					type: Date, // `type` is optional and will be derived from `value`
					format: 'mm/dd/yyyy'
				})
			},
			{
				header: 'Income',
				cell: (person) => ({
					value: person.income,
					type: Number, // `type` is optional and will be derived from `value`
					format: '#,##0.00'
				})
			},
			{
				header: 'Married',
				cell: (person) => ({
					value: person.married,
					type: Boolean // `type` is optional and will be derived from `value`
				})
			},
			{
				header: undefined, // no header
				cell: () => ({
					value: '(empty)'
				})
			}
		]

		expect(getSheetData(objects, columns)).to.deep.equal([
			[
				{ value: 'Name', fontWeight: 'bold' },
				'Date of Birth',
				'Income',
				'Married',
				null
			],
			[
				{ value: 'John Smith' },
				{ value: new Date('2000-01-05T00:00:00.000Z'), type: Date, format: 'mm/dd/yyyy' },
				{ value: 120000, type: Number, format: '#,##0.00' },
				{ value: true, type: Boolean },
				{ value: '(empty)' }
			],
			[
				{ value: 'Alice Brown' },
				{ value: new Date('2005-04-03T00:00:00.000Z'), type: Date, format: 'mm/dd/yyyy' },
				{ value: 60000, type: Number, format: '#,##0.00' },
				{ value: false, type: Boolean },
				{ value: '(empty)' }
			]
		])
	})

	it('should convert objects to sheet data (no column titles)', () => {
		// Data as JSON objects
		const objects = [
			{
				name: 'John Smith',
				married: true
			},
			{
				name: 'Alice Brown',
				married: false
			}
		]

		// A list of columns in the output sheet
		const columns = [
			{
				cell: (person) => ({
					value: person.name
				})
			},
			{
				cell: (person) => ({
					value: person.married
				})
			}
		]

		expect(getSheetData(objects, columns)).to.deep.equal([
			[
				{ value: 'John Smith' },
				{ value: true }
			],
			[
				{ value: 'Alice Brown' },
				{ value: false }
			]
		])
	})
})
