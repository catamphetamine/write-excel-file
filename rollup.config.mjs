import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

export default [
  // Main export.
  {
    input: './modules/export/writeXlsxFileBrowser',
    plugins: [
      json(),
      terser(),
      nodeResolve({
        browser: true
      }),
      commonjs()
    ],
    external: [
      // 'react',
      // 'prop-types'
    ],
    output: {
      format: 'umd',
      name: 'writeXlsxFile',
      file: 'bundle/write-excel-file.min.js',
      sourcemap: true,
      globals: {
        // 'react': 'React',
        // 'prop-types': 'PropTypes'
      }
    }
  },

  // `getSheetData()` function is used on the demo page.
  {
    input: './source/getSheetData/getSheetData.js',
    plugins: [
      json(),
      terser(),
      nodeResolve({
        browser: true
      }),
      commonjs()
    ],
    external: [
      // 'react',
      // 'prop-types'
    ],
    output: {
      format: 'umd',
      name: 'getSheetData',
      file: 'bundle/getSheetData.min.js',
      sourcemap: true,
      globals: {
        // 'react': 'React',
        // 'prop-types': 'PropTypes'
      }
    }
  },

  // Test cases.
  {
    input: './test/writeXlsxFile.testCases.js',
    plugins: [
      json(),
      terser(),
      nodeResolve({
        browser: true
      }),
      commonjs()
    ],
    output: {
      format: 'umd',
      name: 'TEST_CASES',
      file: 'bundle/test-cases.js',
      sourcemap: true
    }
  }
]