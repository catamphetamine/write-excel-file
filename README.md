# `write-excel-file`

Write simple `*.xlsx` files in a browser or Node.js

[Demo](https://catamphetamine.gitlab.io/write-excel-file/)

Also check out [`read-excel-file`](https://www.npmjs.com/package/read-excel-file) for reading small to medium `*.xlsx` files.

## Install

```js
npm install write-excel-file --save
```

If you're not using a bundler then use a [standalone version from a CDN](#cdn).

## Use

To write an `*.xlsx` file, provide the `data` — an array of rows, each row being an array of cells, each cell having a `type` and a `value`:

```js
const data = [
  // Row #1
  [
    // Column #1
    {
      value: 'Name',
      fontWeight: 'bold'
    },
    // Column #2
    {
      value: 'Date of Birth',
      fontWeight: 'bold'
    },
    // Column #3
    {
      value: 'Cost',
      fontWeight: 'bold'
    },
    // Column #4
    {
      value: 'Paid',
      fontWeight: 'bold'
    }
  ],
  // Row #2
  [
    // Column #1
    {
      // `type` is optional
      type: String,
      value: 'John Smith'
    },
    // Column #2
    {
      // `type` is optional
      type: Date,
      value: new Date(),
      format: 'mm/dd/yyyy'
    },
    // Column #3
    {
      // `type` is optional
      type: Number,
      value: 1800
    },
    // Column #4
    {
      // `type` is optional
      type: Boolean,
      value: true
    }
  ],
  // Row #3
  [
    // Column #1
    {
      // `type` is optional
      type: String,
      value: 'Alice Brown'
    },
    // Column #2
    {
      // `type` is optional
      type: Date,
      value: new Date(),
      format: 'mm/dd/yyyy'
    },
    // Column #3
    {
      // `type` is optional
      type: Number,
      value: 2600
    },
    // Column #4
    {
      // `type` is optional
      type: Boolean,
      value: false
    }
  ]
]
```

Or, alternatively, provide a list of `objects` and a `schema` to transform those `objects` into `data`:

```js
const objects = [
  // Object #1
  {
    name: 'John Smith',
    dateOfBirth: new Date(),
    cost: 1800,
    paid: true
  },
  // Object #2
  {
    name: 'Alice Brown',
    dateOfBirth: new Date(),
    cost: 2600,
    paid: false
  }
]
```

```js
const schema = [
  // Column #1
  {
    column: 'Name',
    type: String,
    value: student => student.name
  },
  // Column #2
  {
    column: 'Date of Birth',
    type: Date,
    format: 'mm/dd/yyyy',
    value: student => student.dateOfBirth
  },
  // Column #3
  {
    column: 'Cost',
    type: Number,
    format: '#,##0.00',
    value: student => student.cost
  },
  // Column #4
  {
    column: 'Paid',
    type: Boolean,
    value: student => student.paid
  }
]
```

If no `type` is specified for a cell then it is automatically detected from the cell `value`, but only when not using a `schema`. If `type` couldn't be detected from the cell `value`, it defaults to a `String`.

<!--
There're also some additional exported `type`s available:

* `Integer` for integer `Number`s.
* `URL` for URLs.
* `Email` for email addresses.
-->

Aside from having an optional `type` and a `value`, each cell (or schema column) can also have:

* `align: string` — Horizontal alignment of cell content. Available values: `"left"`, `"center"`, `"right"`.

* `alignVertical: string` — Vertical alignment of cell content. Available values: `"top"`, `"center"`, `"bottom"`.

* `height: number` — Row height, in "points".

* `span: number` — Column span. Even if a cell spans several columns, you still have to provide a value for every cell in every row and column.

* `rowSpan: number` — Row span. Even if a cell spans several rows, you still have to provide a value for every cell in every row and column.

* `wrap: boolean` — Set to `true` to ["wrap"](https://www.excel-easy.com/examples/wrap-text.html) text when it overflows the cell.

* `fontWeight: string` — Can be used to print text in bold. Available values: `"bold"`.

* `fontStyle: string` — Can be used to make text appear italicized. Available values: `"italic"`.

* `color: string` — Cell text color (in hexademical format). Example: `"#aabbcc"`.

* `backgroundColor: string` — Cell background color (in hexademical format). Example: `"#aabbcc"`.

* `borderColor: string` — Cell border color. Example: `"#aabbcc"`.

* `borderStyle: string` — Cell border style. Example: `"thick"`.

  * `leftBorderColor`
  * `leftBorderStyle`
  * `rightBorderColor`
  * `rightBorderStyle`
  * `topBorderColor`
  * `topBorderStyle`
  * `bottomBorderColor`
  * `bottomBorderStyle`

<!-- * `width: number` — Approximate column width (in characters). Example: `20`. -->

<!--
* `formatId: number` — A [built-in](https://xlsxwriter.readthedocs.io/format.html#format-set-num-format) Excel data format ID (like a date or a currency). Example: `4` for formatting `12345.67` as `12,345.67`.
-->

* `format: string` — Cell data format. Can only be used on `Date` or `Number` <!-- or `Integer` --> cells. There're [many formats](https://xlsxwriter.readthedocs.io/format.html#format-set-num-format) supported in the `*.xlsx` standard. Some of the common ones:

  * `0.00` — Floating-point number with 2 decimal places. Example: `1234.56`.
  * `0.000` — Floating-point number with 3 decimal places. Example: `1234.567`.
  * `#,##0` — Number with a comma as a thousands separator, as used in most English-speaking countries. Example: `1,234,567`.
  * `#,##0.00` — Currency, as in most English-speaking countries. Example: `1,234.50`.
  * `0%` — Percents. Example: `30%`.
  * `0.00%` — Percents with 2 decimal places. Example: `30.00%`.
  * All `Date` cells (or schema columns) require a `format` (unless the [default `dateFormat`](#date-format) is set):

    * `mm/dd/yy` — US date format. Example: `12/31/00` for December 31, 2000.
    * `mmm d yyyy` — Example: `Dec 31 2000`.
    * `d mmmm yyyy` — Example: `31 December 2000`.
    * `dd/mm/yyyy hh:mm AM/PM` — US date-time format. Example: `31/12/2000 12:30 AM`.
    * or any other format where:

      * `yy` — Last two digits of a year number.
      * `yyyy` — Four digits of a year number.
      * `m` — Month number without a leading `0`.
      * `mm` — Month number with a leading `0` (when less than `10`).
      * `mmm` — Month name (short).
      * `mmmm` — Month name (long).
      * `d` — Day number without a leading `0`.
      * `dd` — Day number with a leading `0` (when less than `10`).
      * `h` — Hours without a leading `0`.
      * `hh` — Hours with a leading `0` (when less than `10`).
      * `mm` — Minutes with a leading `0` (when less than `10`).
      * `ss` — Seconds with a leading `0` (when less than `10`).
      * `AM/PM` — Either `AM` or `PM`, depending on the time.

## API

### Browser

```js
import writeXlsxFile from 'write-excel-file'

// When passing `data` for each cell.
await writeXlsxFile(data, {
  columns, // optional
  fileName: 'file.xlsx'
})

// When passing `objects` and `schema`.
await writeXlsxFile(objects, {
  schema,
  fileName: 'file.xlsx'
})

```

Uses [`file-saver`](https://www.npmjs.com/package/file-saver) to save an `*.xlsx` file from a web browser.

If `fileName` parameter is not passed then the returned `Promise` resolves to a ["blob"](https://github.com/egeriis/zipcelx/issues/68) with the contents of the `*.xlsx` file.

### Node.js

```js
const writeXlsxFile = require('write-excel-file/node')

// When passing `data` for each cell.
await writeXlsxFile(data, {
  columns, // optional
  filePath: '/path/to/file.xlsx'
})

// When passing `objects` and `schema`.
await writeXlsxFile(objects, {
  schema,
  filePath: '/path/to/file.xlsx'
})
```

If `filePath` parameter is not passed then the returned `Promise` resolves to a `Stream`-like object having a `.pipe()` method:

```js
const output = fs.createWriteStream(...)
const stream = await writeXlsxFile(objects)
stream.pipe(output)
```

## Table Header

#### Schema

When using a `schema`, column titles can be set via a `column` property on each column. It will be printed at the top of the table.

```js
const schema = [
  // Column #1
  {
    column: 'Name', // Column title
    value: student => student.name
  },
  ...
]
```

If `column` property is missing then column title won't be printed.

The default table header style is `fontWeight: "bold"` and `align` being same as the schema column's `align`. One can provide a custom table header style by supplying a `headerStyle` parameter:

```js
await writeXlsxFile(objects, {
  schema,
  headerStyle: {
    backgroundColor: '#eeeeee',
    fontWeight: 'bold',
    align: 'center'
  },
  filePath: '/path/to/file.xlsx'
})
```

#### Cell Data

When not using a schema, one can print column titles by supplying them as the first row of the `data`:

```js
const data = [
  [
    { value: 'Name', fontWeight: 'bold' },
    { value: 'Age', fontWeight: 'bold'},
    ...
  ],
  ...
]
```

## Column Width

Column width can also be specified (in "characters").

#### Schema

To specify column width when using a `schema`, set a `width` on a schema column:

```js
const schema = [
  // Column #1
  {
    column: 'Name',
    value: student => student.name,
    width: 20 // Column width (in characters).
  },
  ...
]
```

#### Cell Data

When not using a schema, one can provide a separate `columns` parameter to specify column widths:

```js
// Set Column #3 width to "20 characters".
const columns = [
  {},
  {},
  { width: 20 }, // in characters
  {}
]
```

## Font

The default font is `Calibri` at `12px`. To change the default font, pass `fontFamily` and `fontSize` parameters when calling `writeXlsxFile()`:

```js
await writeXlsxFile(data, {
  filePath: '/path/to/file.xlsx',
  fontFamily: 'Arial',
  fontSize: 16
})
```

## Date Format

To set the default date format, pass `dateFormat` parameter when calling `writeXlsxFile()`:

```js
await writeXlsxFile(data, {
  filePath: '/path/to/file.xlsx',
  dateFormat: 'mm/dd/yyyy'
})
```

## Sheet name

To set the default sheet name, pass a `sheet` parameter when calling `writeXlsxFile()`:

```js
await writeXlsxFile(data, {
  filePath: '/path/to/file.xlsx',
  sheet: 'Data'
})
```

## Multiple Sheets

#### Schema

To generate an `*.xlsx` file with multiple sheets:

* Pass a `sheets` parameter — an array of sheet names.
* The `objects` argument should be an array of `objects` for each sheet.
* The `schema` parameter should be an array of `schema`s for each sheet.

```js
await writeXlsxFile([objects1, objects2], {
  schema: [schema1, schema2],
  sheets: ['Sheet 1', 'Sheet 2'],
  filePath: '/path/to/file.xlsx'
})
```

#### Cell Data

To generate an `*.xlsx` file with multiple sheets:

* Pass a `sheets` parameter — an array of sheet names.
* The `data` argument should be an array of `data` for each sheet.
* (optional) The `columns` parameter should be an array of `columns` for each sheet.

```js
await writeXlsxFile([data1, data2], {
  columns: [columns1, columns2], // (optional)
  sheets: ['Sheet 1', 'Sheet 2'],
  filePath: '/path/to/file.xlsx'
})
```

## TypeScript

This library comes with TypeScript "typings". If you happen to find any bugs in those, create an issue.

## CDN

One can use any npm CDN service, e.g. [unpkg.com](https://unpkg.com) or [jsdelivr.net](https://jsdelivr.net)

```html
<script src="https://unpkg.com/write-excel-file@1.x/bundle/write-excel-file.min.js"></script>

<script>
  writeXlsxFile(objects, schema, {
    fileName: 'file.xlsx'
  })
</script>
```

## References

This project was inspired by [`zipcelx`](https://medium.com/@Nopziiemoo/create-excel-files-using-javascript-without-all-the-fuss-2c4aa5377813) package.

## GitHub

On March 9th, 2020, GitHub, Inc. silently [banned](https://medium.com/@catamphetamine/how-github-blocked-me-and-all-my-libraries-c32c61f061d3) my account (erasing all my repos, issues and comments, even in my employer's private repos) without any notice or explanation. Because of that, all source codes had to be promptly moved to GitLab. The [GitHub repo](https://github.com/catamphetamine/write-excel-file) is now only used as a backup (you can star the repo there too), and the primary repo is now the [GitLab one](https://gitlab.com/catamphetamine/write-excel-file). Issues can be reported in any repo.

## License

[MIT](LICENSE)

