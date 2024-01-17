# `write-excel-file`

Write simple `*.xlsx` files in a browser or Node.js

[Demo](https://catamphetamine.gitlab.io/write-excel-file/)

Also check out [`read-excel-file`](https://www.npmjs.com/package/read-excel-file) for reading small to medium `*.xlsx` files.

## Install

```js
npm install write-excel-file --save
```

If you're not using a bundler then use a [standalone version from a CDN](#cdn).

## Data

To write an `*.xlsx` file, one should provide the `data` — an array of rows. Each row must be an array of cells.

Each cell should have a `value`, a `type`, and, optionally, other [cell parameters](#cell-parameters).

If a cell doesn't have a `type`, then it is automatically detected from the `value`, or defaults to a `String`. Possible `type`s are:
* `String`
* `Number`
* `Boolean`
* `Date`
* `"Formula"`
<!-- * `"Image"` -->

An empty cell could be represented by `null` or `undefined`.

```js
const HEADER_ROW = [
  {
    value: 'Name',
    fontWeight: 'bold'
  },
  {
    value: 'Date of Birth',
    fontWeight: 'bold'
  },
  {
    value: 'Cost',
    fontWeight: 'bold'
  },
  {
    value: 'Paid',
    fontWeight: 'bold'
  }
]

const DATA_ROW_1 = [
  // "Name"
  {
    type: String,
    value: 'John Smith'
  },

  // "Date of Birth"
  {
    type: Date,
    value: new Date(),
    format: 'mm/dd/yyyy'
  },

  // "Cost"
  {
    type: Number,
    value: 1800
  },

  // "Paid"
  {
    type: Boolean,
    value: true
  }
]

const data = [
  HEADER_ROW,
  DATA_ROW_1,
  ...
]
```

## API

### Browser

```js
import writeXlsxFile from 'write-excel-file'

await writeXlsxFile(data, {
  columns, // (optional) column widths, etc.
  fileName: 'file.xlsx'
})
```

Uses [`file-saver`](https://www.npmjs.com/package/file-saver) to save an `*.xlsx` file from a web browser.

If `fileName` parameter is not passed then the returned `Promise` resolves to a ["blob"](https://github.com/egeriis/zipcelx/issues/68) with the contents of the `*.xlsx` file.

### Node.js

```js
const writeXlsxFile = require('write-excel-file/node')

await writeXlsxFile(data, {
  columns, // (optional) column widths, etc.
  filePath: '/path/to/file.xlsx'
})
```

If `filePath` parameter is not passed, but `buffer: true` parameter is passed, then it returns a `Buffer`:

```js
const buffer = await writeXlsxFile(data, { buffer: true })
```

If neither `filePath` parameter nor `buffer: true` parameter are passed, then it returns a readable `Stream`:

```js
const output = fs.createWriteStream(...)
const stream = await writeXlsxFile(data)
stream.pipe(output)
```

<details>
<summary>AWS S3 might refuse to accept the <code>stream</code></summary>

#####

AWS S3 might throw `Cannot determine length of [object Object]`:

```js
await new AWS.S3().putObject({
  Bucket: ...,
  Key: ...,
  Body: stream,
  ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}).promise()
```

The reason is that AWS S3 [only accepts streams of known length](https://github.com/aws/aws-sdk-js/issues/2961), and the length of a zip file can't be known in advance.

Workaround for AWS SDK v2: write to `Buffer` instead of a stream.

Workaround for AWS SDK [v3](https://aws.amazon.com/blogs/developer/modular-packages-in-aws-sdk-for-javascript/): use [`Upload`](https://github.com/aws/aws-sdk-js/issues/2961#issuecomment-868352176) operation.
</details>

## Schema

Alternatively, instead of providing `data`, one could provide a list of `objects` and a `schema` describing each column:

```js
const objects = [
  {
    name: 'John Smith',
    dateOfBirth: new Date(),
    cost: 1800,
    paid: true
  },
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
  {
    column: 'Name',
    type: String,
    value: student => student.name
  },
  {
    column: 'Date of Birth',
    type: Date,
    format: 'mm/dd/yyyy',
    value: student => student.dateOfBirth
  },
  {
    column: 'Cost',
    type: Number,
    format: '#,##0.00',
    value: student => student.cost
  },
  {
    column: 'Paid',
    type: Boolean,
    value: student => student.paid
  }
]
```

When using a `schema`, column `type`s are required (not autodetected).

### Schema API

#### Browser

```js
import writeXlsxFile from 'write-excel-file'

await writeXlsxFile(objects, {
  schema,
  fileName: 'file.xlsx'
})
```

#### Node.js

```js
const writeXlsxFile = require('write-excel-file/node')

await writeXlsxFile(objects, {
  schema,
  filePath: '/path/to/file.xlsx'
})
```

## Cell Parameters

<!--
There're also some additional exported `type`s available:

* `Integer` for integer `Number`s.
* `URL` for URLs.
* `Email` for email addresses.
-->

Aside from having a `type` and a `value`, each cell (or schema column) can also have:

* `align: string` — Horizontal alignment of cell content. Available values: `"left"`, `"center"`, `"right"`.

* `alignVertical: string` — Vertical alignment of cell content. Available values: `"top"`, `"center"`, `"bottom"`.

* `textRotation: number` — Text rotation angle. Values from `-90` to `90` are supported. Positive values rotate the text counterclockwise, and negative values rotate the text clockwise.

* `height: number` — Row height, in "points".

* `span: number` — Column span. Even if a cell spans `N` columns, it should still be represented as `N` individual cells in the `data`. In that case, all the cells except the left-most one will be ignored. One could use `null` or `undefined` to represent such ignored cells. For example, if the first cell in a row spans 3 columns, then the row would look like `[{ value: 'Text', span: 3 }, null, null, { value: 'After text' }]`.

* `rowSpan: number` — Row span. Even if a cell spans `N` rows, it should still be represented as `N` individual cells in the `data`. In that case, all the cells except the top-most one will be ignored. One could use `null` or `undefined` to represent such ignored cells. For example, if the top left cell spans 2 rows, then the first row would look like `[{ value: 'Rows', rowSpan: 2 }, { value: 'R1' }]` and the second row would look like `[null, { value: 'R2' }]`.

* `wrap: boolean` — Set to `true` to ["wrap"](https://www.excel-easy.com/examples/wrap-text.html) text when it overflows the cell.

* `fontFamily: string` — Can be used to print text in a custom font family. Example: `"Calibri"`.

* `fontSize: number` — Can be used to print text in a custom font size. Example: `12`.

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

* `format: string` — Cell data format. Can only be used on `Date`, `Number` or `"Formula"` <!-- or `Integer` --> cells. There're [many formats](https://xlsxwriter.readthedocs.io/format.html#format-set-num-format) supported in the `*.xlsx` standard. Some of the common ones:

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

## Orientation

To specify custom orientation (for all sheets), pass `orientation` parameter when calling `writeXlsxFile()`:

```js
await writeXlsxFile(data, {
  filePath: '/path/to/file.xlsx',
  orientation: 'landscape'
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

## Sticky Rows

To make some of the top rows "sticky" (Excel calls them "frozen"), pass `stickyRowsCount` parameter when calling `writeXlsxFile()`:

```js
await writeXlsxFile(data, {
  filePath: '/path/to/file.xlsx',
  stickyRowsCount: 1
})
```

## Sticky Columns

To make some of the columns at the start "sticky" (Excel calls them "frozen"), pass `stickyColumnsCount` parameter when calling `writeXlsxFile()`:

```js
await writeXlsxFile(data, {
  filePath: '/path/to/file.xlsx',
  stickyColumnsCount: 1
})
```

## Sheet Name

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

## Images

<!--
To insert an image into a cell, specify a cell of `type: "Image"`:

```js
{
  type: "Image",
  value: {
    // In a web browser, `data` could be any of: `File`, `Blob`, `ArrayBuffer`.
    // In Node.js, `data` could be any of: `String` (path), `Buffer`, `Readable` (stream).
    data: any,
    width: number,
    height: number,
    name?: string,
    description?: string
  }
}
```
-->

This library currently doesn't support inserting images in a spreadsheet, although implementing such feature would be kinda trivial because I've already researched it a bit and described the implementation instructions in a [document](https://gitlab.com/catamphetamine/write-excel-file/-/blob/main/docs/IMAGES.md).

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

