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
        age: 18,
        dateOfBirth: new Date(),
        graduated: true
      },
      {
        name: 'Alice Brown',
        age: 16,
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
        column: 'Age',
        type: Number,
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
          value: 'Age',
          fontWeight: 'bold'
        },
        {
          value: 'Date of Birth',
          fontWeight: 'bold'
        },
        {
          value: 'Name',
          fontWeight: 'bold'
        }
      ],
      [
        {
          value: 18,
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
          type: String
        },
        {
          value: true,
          type: Boolean
        }
      ],
      [
        {
          value: 16,
          type: Number,
          align: 'right'
        },
        {
          value: new Date(),
          type: Date,
          format: 'mm/dd/yyyy'
        },
        {
          value: 'Alice Brown',
          type: String
        },
        {
          value: false,
          type: Boolean
        }
      ]
    ]

    const columns = [
      {},
      { width: 14 },
      { width: 20 }
      // Fourth column missing intentionally
    ]

    await writeXlsxFile(objects, { schema, filePath: path.join(OUTPUT_DIRECTORY, 'test-schema.xlsx') })
    await writeXlsxFile(objects, { schema: schemaNoSingleTitle, filePath: path.join(OUTPUT_DIRECTORY, 'test-schema-no-single-title.xlsx') })
    await writeXlsxFile(objects, { schema: schemaNoTitles, filePath: path.join(OUTPUT_DIRECTORY, 'test-schema-no-titles.xlsx') })

    await writeXlsxFile(data, { columns, filePath: path.join(OUTPUT_DIRECTORY, 'test-cells.xlsx') })

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