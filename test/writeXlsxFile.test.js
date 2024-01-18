// node --require ./babel.js test/writeXlsxFile

import path from 'path'
import fs from 'fs'

import writeXlsxFile from '../source/write/writeXlsxFileNode.js'

const OUTPUT_DIRECTORY = path.resolve('./test-output')

describe('writeXlsxFile', function() {
  it('should generate *.xlsx files', async function() {
    if (!fs.existsSync(OUTPUT_DIRECTORY)) {
      fs.mkdirSync(OUTPUT_DIRECTORY)
    }

    const objects = [
      {
        name: 'John Smith',
        age: 1800,
        dateOfBirth: new Date(),
        graduated: true
      },
      {
        name: 'Alice Brown',
        age: 2600.50,
        dateOfBirth: new Date(),
        graduated: false
      }
    ]

    const schema = [
      {
        column: 'Name',
        type: String,
        value: student => student.name,
        align: 'right',
        width: 20
      },
      {
        column: 'Cost',
        type: Number,
        format: '#,##0.00',
        width: 12,
        align: 'center',
        value: student => student.age
      },
      {
        column: 'Date of Birth',
        type: Date,
        format: 'mm/dd/yyyy',
        value: student => student.dateOfBirth
      },
      {
        column: 'Graduated',
        type: Boolean,
        value: student => student.graduated
      }
    ]

    const schemaNoSingleTitle = schema.slice()
    schemaNoSingleTitle[1] = {
      ...schemaNoSingleTitle[1],
      column: undefined
    }

    const schemaNoTitles = schema.slice()
    for (let i = 0; i < schemaNoTitles.length; i++) {
      schemaNoTitles[i] = {
        ...schemaNoTitles[i],
        column: undefined
      }
    }

    const data = [
      [
        {
          value: 'Cost',
          fontWeight: 'bold'
        },
        {
          value: 'Date of Birth',
          fontWeight: 'bold',
          fontStyle: 'italic',
          height: 48
        },
        {
          value: 'Name',
          fontWeight: 'bold'
        }
      ],
      [
        {
          value: 180.00,
          format: '#,##0.00',
          type: Number,
          align: 'center',
          fontWeight: 'bold'
        },
        {
          value: new Date(),
          type: Date,
          format: 'mm/dd/yyyy'
        },
        {
          value: 'John Smith',
          type: String,
          backgroundColor: '#FFFF00'
        },
        {
          value: true,
          type: Boolean
        },
        {
          value: 'HYPERLINK("https://example.com", "A link")',
          type: 'Formula'
        }
      ],
      [
        {
          value: 200.50,
          format: '#,##0.00',
          type: Number,
          align: 'right',
          alignVertical: 'top'
        },
        {
          value: new Date(),
          type: Date,
          format: 'mm/dd/yyyy',
          align: 'center',
          alignVertical: 'bottom'
        },
        {
          value: 'Alice Brown\nNew line',
          type: String,
          color: '#ff0000',
          backgroundColor: '#eeeeee',
          align: 'left',
          wrap: true
        },
        {
          value: false,
          type: Boolean,
          alignVertical: 'center'
        },
        {
          value: 'HYPERLINK("https://google.com", "Google.com")',
          type: 'Formula'
        }
      ]
    ]

    const dataWithCustomFontInFirstCell = data.slice()
    dataWithCustomFontInFirstCell[0] = dataWithCustomFontInFirstCell[0].slice()
    dataWithCustomFontInFirstCell[0][0] = {
      ...dataWithCustomFontInFirstCell[0][0],
      fontFamily: 'Courier New',
      fontSize: 8
    }

    const dataWithTextRotation = data.slice()
    dataWithTextRotation[0] = dataWithTextRotation[0].slice()
    dataWithTextRotation[0][0] = {
      ...dataWithTextRotation[0][0],
      fontFamily: 'Courier New',
      fontSize: 8,
      textRotation: -90
    }
    dataWithTextRotation[0][1] = {
      ...dataWithTextRotation[0][1],
      fontFamily: 'Courier New',
      fontSize: 8,
      textRotation: 90
    }

    const columns = [
      {},
      { width: 14 },
      { width: 20 }
      // Fourth column missing intentionally
    ]

    // Create `data` with `rowSpan`.
    const dataRowSpan = data.slice()
    let i = 0
    while (i < dataRowSpan.length) {
      dataRowSpan[i] = dataRowSpan[i].slice()
      i++
    }
    dataRowSpan[1][0] = {
      ...dataRowSpan[1][0],
      rowSpan: 2,
      // Add test styles.
      // https://gitlab.com/catamphetamine/write-excel-file/-/issues/43
      borderStyle: 'thick',
      borderColor: '#cc0000'
    }
    dataRowSpan[2][0] = null

    await writeXlsxFile(objects, { schema, sheet: 'Test Schema', filePath: path.join(OUTPUT_DIRECTORY, 'test-schema.xlsx') })
    await writeXlsxFile([objects, objects], { sheets: ['Sheet One', 'Sheet Two'], schema: [schema, schema], filePath: path.join(OUTPUT_DIRECTORY, 'test-schema-multiple-sheets.xlsx') })
    await writeXlsxFile(objects, { schema: schema, filePath: path.join(OUTPUT_DIRECTORY, 'test-schema-header-style.xlsx'), headerStyle: { align: 'center', color: '#cc0000', backgroundColor: '#eeeeee' } })
    await writeXlsxFile(objects, { schema: schemaNoSingleTitle, filePath: path.join(OUTPUT_DIRECTORY, 'test-schema-no-single-title.xlsx') })
    await writeXlsxFile(objects, { schema: schemaNoTitles, filePath: path.join(OUTPUT_DIRECTORY, 'test-schema-no-titles.xlsx') })

    await writeXlsxFile(data, { columns, filePath: path.join(OUTPUT_DIRECTORY, 'test-cells.xlsx') })
    await writeXlsxFile(dataWithCustomFontInFirstCell, { columns, filePath: path.join(OUTPUT_DIRECTORY, 'test-cells-custom-font.xlsx') })
    await writeXlsxFile(dataWithTextRotation, { columns, filePath: path.join(OUTPUT_DIRECTORY, 'test-cells-text-rotation.xlsx') })
    await writeXlsxFile(data, { columns, stickyRowsCount: 1, filePath: path.join(OUTPUT_DIRECTORY, 'test-cells-sticky-row.xlsx') })
    await writeXlsxFile(data, { columns, stickyRowsCount: 2, filePath: path.join(OUTPUT_DIRECTORY, 'test-cells-sticky-rows.xlsx') })
    await writeXlsxFile(data, { columns, stickyColumnsCount: 1, filePath: path.join(OUTPUT_DIRECTORY, 'test-cells-sticky-column.xlsx') })
    await writeXlsxFile(data, { columns, stickyColumnsCount: 2, filePath: path.join(OUTPUT_DIRECTORY, 'test-cells-sticky-columns.xlsx') })
    await writeXlsxFile(data, { columns, stickyRowsCount: 1, stickyColumnsCount: 1, filePath: path.join(OUTPUT_DIRECTORY, 'test-cells-sticky-row-and-column.xlsx') })
    await writeXlsxFile(dataRowSpan, { columns, filePath: path.join(OUTPUT_DIRECTORY, 'test-cells-row-span.xlsx') })
    await writeXlsxFile(data, { columns, filePath: path.join(OUTPUT_DIRECTORY, 'test-cells-landscape.xlsx'), orientation: 'landscape' })
    await writeXlsxFile([data, data], { sheets: ['Sheet One', 'Sheet Two'], columns: [columns, columns], filePath: path.join(OUTPUT_DIRECTORY, 'test-cells-multiple-sheets.xlsx') })
    await writeXlsxFile(data, { columns, filePath: path.join(OUTPUT_DIRECTORY, 'test-default-font.xlsx'), fontFamily: 'Arial', fontSize: 16 })

    await shouldThrow('empty', async () => {
      await writeXlsxFile([data], { columns: [columns], filePath: path.join(OUTPUT_DIRECTORY, 'test-illegal-characters-in-sheet-name.xlsx'), sheets: [''] })
    })

    await shouldThrow('longer than', async () => {
      await writeXlsxFile(data, { columns, filePath: path.join(OUTPUT_DIRECTORY, 'test-illegal-characters-in-sheet-name.xlsx'), sheet: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
    })

    await shouldThrow('illegal', async () => {
      await writeXlsxFile(data, { columns, filePath: path.join(OUTPUT_DIRECTORY, 'test-illegal-characters-in-sheet-name.xlsx'), sheet: 'a/b' })
    })

    // https://gitlab.com/catamphetamine/write-excel-file/-/issues/49
    // Illegal sheet name characters.

    // Test cell data type autodetection.
    await writeXlsxFile(
      data.map(row => row.map(cell => ({
        ...cell,
        type: undefined,
        format: undefined
      }))),
      {
        columns,
        dateFormat: 'mm/dd/yyyy',
        filePath: path.join(OUTPUT_DIRECTORY, 'test-cells-autodetect-type.xlsx')
      }
    )

    const outputStream = fs.createWriteStream(path.join(OUTPUT_DIRECTORY, 'test-stream.xlsx'))

    await new Promise((resolve, reject) => {
      writeXlsxFile(data, { columns }).then((stream) => {
      	stream.pipe(outputStream)
      	stream.on('end', function () {
      	  console.log('XLSX file stream ended')
          // resolve()
      	})
      })

      outputStream.on('close', function() {
        console.log('Output stream closed')
        resolve()
      })
    })

    const buffer = await writeXlsxFile(data, { columns, buffer: true })
    writeBufferToFile(buffer, path.join(OUTPUT_DIRECTORY, 'test-buffer.xlsx'))

    console.log('Check `test-schema.xlsx`, `test-stream.xml` and `test-cells.xlsx` files in the `test` folder')
  })
})

function writeBufferToFile(buffer, path) {
  // open the file in writing mode, adding a callback function where we do the actual writing
  const fd = fs.openSync(path, 'w')
  // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
  fs.writeSync(fd, buffer, 0, buffer.length, null)
  fs.closeSync(fd)
}

async function shouldThrow(message, func) {
  try {
    await func()
    throw new Error('Must throw an error')
  } catch (error) {
    if (error.message.includes(message)) {
      // The error is the expected one.
    } else {
      console.error(error)
      throw new Error(`Expected the error message "${error.message}" to contain "${message}"`)
    }
  }
}