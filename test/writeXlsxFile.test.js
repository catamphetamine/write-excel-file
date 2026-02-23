// node --require ./babel.js test/writeXlsxFile

import path from 'path'
import fs from 'fs'

import writeXlsxFileNode from '../source/export/writeXlsxFileNode.js'
import writeXlsxFileUniversal from '../source/export/writeXlsxFileUniversal.js'

import TEST_CASES from './writeXlsxFile.testCases.node.js'

const OUTPUT_DIRECTORY = path.resolve('./test-output')

describe('writeXlsxFile', function() {
  it('should generate *.xlsx files', async function() {
    clearFolder(OUTPUT_DIRECTORY)

    // if (!fs.existsSync(OUTPUT_DIRECTORY)) {
    //   fs.mkdirSync(OUTPUT_DIRECTORY)
    // }

    // Run test cases.
    for (const testCaseId of Object.keys(TEST_CASES)) {
      // console.log(`Running test case "${testCaseId}"`)
      const testCase = TEST_CASES[testCaseId]
      const filePath = path.join(OUTPUT_DIRECTORY, testCaseId + '.xlsx')
      try {
        if (testCase.run) {
          await testCase.run({ filePath, writeXlsxFile: writeXlsxFileNode })
        } else if (testCase.args) {
          let [arg1, arg2, ...argsRest] = testCase.args()
          arg2 = {
            ...arg2,
            filePath
          }
          await writeXlsxFileNode.apply(this, [arg1, arg2, ...argsRest])
        } else {
          throw new Error(`Unsupported test case object:\n${JSON.stringify(testCase, null, 2)}`)
        }
      } catch (error) {
        console.error(`Error while running test case "${testCaseId}":`)
        throw error
      }
    }

    // Test `writeXlsxFileUniversal()` function.
    const universalOutputBlob = await writeXlsxFileUniversal([['a', 'b', 'c'], [1, 2, 3]])
    const universalOutputBuffer = Buffer.from(await universalOutputBlob.arrayBuffer())
    await fs.writeFileSync(path.join(OUTPUT_DIRECTORY, 'universal.xlsx'), universalOutputBuffer)

    console.log('Check `*.xlsx` files in the `./test-output` folder')

    // Empty string passed as sheet name.
    // https://gitlab.com/catamphetamine/write-excel-file/-/issues/49
    await shouldThrow('empty', async () => {
      await writeXlsxFileUniversal([[[1, 2, 3], [4, 5, 6]]], {
        columns: [[{}]],
        sheets: ['']
      })
    })

    // Sheet name too long.
    // https://gitlab.com/catamphetamine/write-excel-file/-/issues/49
    await shouldThrow('longer than', async () => {
      await writeXlsxFileUniversal([[1, 2, 3], [4, 5, 6]], {
        columns: [{}],
        sheet: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      })
    })

    // Illegal sheet name characters.
    // https://gitlab.com/catamphetamine/write-excel-file/-/issues/49
    await shouldThrow('illegal', async () => {
      await writeXlsxFileUniversal([[1, 2, 3], [4, 5, 6]], {
        columns: [{}],
        sheet: 'a/b'
      })
    })
  })
})

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

async function clearFolder(folderPath) {
  fs.rmSync(folderPath, { recursive: true, force: true })
  fs.mkdirSync(folderPath, { recursive: true })
}