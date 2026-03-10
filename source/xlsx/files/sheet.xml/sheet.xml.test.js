import { describe, it } from 'mocha'
import { expect } from 'chai'

import generateSheetXml from './sheet.xml.js'

describe('generateSheetXml()', () => {
  it('Should generate XML Worksheet', () => {
  	const colsXml = ''
  	const rowsXml = '<row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1"><v>1000</v></c></row>'

    // const paneXml = '<pane ySplit="0" xSplit="0" topLeftCell="A1" activePane="bottomRight" state="frozen"/>'
    // const sheetViewsXml = '<sheetViews><sheetView tabSelected="0" workbookViewId="0">' + paneXml + '</sheetView></sheetViews>'
    // const sheetViewsXml = '<sheetViews><sheetView tabSelected="0" workbookViewId="0"/></sheetViews>'
    const sheetViewsXml = ''

    const expectedXML = '<?xml version="1.0" ?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main">' +
        sheetViewsXml +
        colsXml +
        '<sheetData>' +
          rowsXml +
        '</sheetData>' +
        '<drawing r:id="rId-drawing-1"/>' +
      '</worksheet>'

    const data = [
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
    ]

    expect(
      generateSheetXml(
        {
          findOrCreateSharedString(string) {
            return 0
          },
          data,
          sheetId: 1,
          multipleSheetsParameters: true
        },
        []
      )
    ).to.equal(expectedXML)
  })

  it('should detect `span`/`rowSpan` overlap', () => {
    expect(() => {
      generateSheetXml(
        {
          findOrCreateSharedString(string) {
            return 0
          },
          data: [
            [
              {
                value: 'Text',
                span: 3
              },
              null,
              {
                value: 'Text'
              }
            ]
          ],
          sheetId: 1,
          multipleSheetsParameters: true
        },
        []
      )
    }).to.throw('span')
  })
})
