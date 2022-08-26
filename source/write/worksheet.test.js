// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/__test__/zipcelx.spec.js

import generateWorksheet from './worksheet.js'

import SharedStrings from './sharedStrings.js'

describe('generateWorksheet()', () => {
  it('Should generate XML Worksheet', () => {
  	const colsXML = '';
  	const rowsXML = '<row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1"><v>1000</v></c></row>';

    const expectedXML = [
      '<?xml version="1.0" ?>',
      `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main">${colsXML}<sheetData>${rowsXML}</sheetData></worksheet>`
    ].join('\n')

    expect(
      generateWorksheet(
        [
          [
            {
              value: 'Test',
              type: String,
              // width: 150
            },
            {
              value: 1000,
              type: Number,
              // width: 60
            }
          ]
        ],
        {
          getSharedString(string) {
            return 0
          },
          sheetId: 1
        }
      )
    ).to.equal(expectedXML)
  })
})