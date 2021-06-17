// node --require ./babel.js test/writeXlsxFile

const path = require('path')
const fs = require('fs')

const writeXlsxFile = require('../source/write/writeXlsxFileNode').default

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
    width: 20
  },
  {
    column: 'Age',
    type: Number,
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

const data = [
  [
    {
      value: 18,
      type: Number
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
      type: Number
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

writeXlsxFile(objects, { schema, filePath: path.join(__dirname, 'test-schema.xlsx') })
writeXlsxFile(data, { filePath: path.join(__dirname, 'test-cells.xlsx') })

const outputStream = fs.createWriteStream(path.join(__dirname, 'test-stream.xlsx'))
writeXlsxFile(data).then((stream) => {
	stream.pipe(outputStream)
	stream.on('end', function () {
	  console.log('XLSX file stream ended')
	})
})

outputStream.on('close', function() {
  console.log('Output stream closed')
})

console.log('Check `test-schema.xlsx`, `test-stream.xml` and `test-cells.xlsx` files in the `test` folder')