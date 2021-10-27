// node --require ./babel.js test/writeXlsxFile

import path from 'path'
import fs from 'fs'

import writeXlsxFile from '../source/write/writeXlsxFileNode'

const OUTPUT_DIRECTORY = path.join(__dirname, '..', 'test-output')

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
        }
      ]
    ]

    const columns = [
      {},
      { width: 14 },
      { width: 20 }
      // Fourth column missing intentionally
    ]

    await writeXlsxFile(objects, { schema, sheet: 'Test Schema', filePath: path.join(OUTPUT_DIRECTORY, 'test-schema.xlsx') })
    await writeXlsxFile([objects, objects], { sheets: ['Sheet One', 'Sheet Two'], schema: [schema, schema], filePath: path.join(OUTPUT_DIRECTORY, 'test-schema-multiple-sheets.xlsx') })
    await writeXlsxFile(objects, { schema: schema, filePath: path.join(OUTPUT_DIRECTORY, 'test-schema-header-style.xlsx'), headerStyle: { align: 'center', color: '#cc0000', backgroundColor: '#eeeeee' } })
    await writeXlsxFile(objects, { schema: schemaNoSingleTitle, filePath: path.join(OUTPUT_DIRECTORY, 'test-schema-no-single-title.xlsx') })
    await writeXlsxFile(objects, { schema: schemaNoTitles, filePath: path.join(OUTPUT_DIRECTORY, 'test-schema-no-titles.xlsx') })

    await writeXlsxFile(data, { columns, filePath: path.join(OUTPUT_DIRECTORY, 'test-cells.xlsx') })
    await writeXlsxFile([data, data], { sheets: ['Sheet One', 'Sheet Two'], columns: [columns, columns], filePath: path.join(OUTPUT_DIRECTORY, 'test-cells-multiple-sheets.xlsx') })
    await writeXlsxFile(data, { columns, filePath: path.join(OUTPUT_DIRECTORY, 'test-default-font.xlsx'), fontFamily: 'Arial', fontSize: 16 })

    // Test cell data type autodetection.
    await writeXlsxFile(
      data.map(row => row.map(cell => ({
        ...cell,
        type: undefined
      }))),
      {
        columns,
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

    console.log('Check `test-schema.xlsx`, `test-stream.xml` and `test-cells.xlsx` files in the `test` folder')
  })
})