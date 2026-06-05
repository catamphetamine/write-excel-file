# `write-excel-file`

Write `.xlsx` files in a browser or Node.js

[Demo](https://catamphetamine.gitlab.io/write-excel-file/)

Also check out [`read-excel-file`](https://www.npmjs.com/package/read-excel-file) for reading `.xlsx` files.

<details>
<summary>Migrating from <code>2.x</code> to <code>3.x</code></summary>

######

* Renamed the default export `"write-excel-file"` to `"write-excel-file/browser"`, and it uses [Web Workers](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers) now.
  * Old: `import writeExcelFile from "write-excel-file"`
  * New: `import writeExcelFile from "write-excel-file/browser"`
* The minimum required Node.js version is 18.
* Renamed cell property `color` to `textColor`.
* Removed `headerStyle` parameter. Pass `getHeaderStyle()` parameter instead.
* `images[]` parameter no longer accepts string values (i.e. file paths). Instead, use `fs.createReadStream(filePath)` function to convert file paths to `Stream`s.
</details>

<details>
<summary>Migrating from <code>3.x</code> to <code>4.x</code></summary>

######

* Changed the arguments of `writeExcelFile()` function.
  * The following options are now passed as part of a separate (third) argument: `fontFamily`, `fontSize`, `features`.

* Changed the arguments of `writeExcelFile()` function when writing a file with mulitiple sheets.
  * Old — two arguments:
    * `[data1, data2]`
    * `{ sheets: ['Sheet1', 'Sheet2'], columns: [columns1, columns2], ... }`
  * New — one argument:
    * `[`
      * `{ data: data1, sheet: 'Sheet1', columns: columns1, ... },`
      * `{ data: data2, sheet: 'Sheet2', columns: columns2, ... }`
    * `]`

* Changed the result of `writeExcelFile()` function.
  * Instead of receiving options such as `fileName` or `filePath` or `buffer: true`, etc, and then adjusting the return type based on those options, it now returns an object with several `async toXxx()` methods.
    * Old: `await writeExcelFile(data, { filePath: '/path/to/output-file.xlsx' })`
    * New: `await writeExcelFile(data).toFile('/path/to/output-file.xlsx')`

* If you were passing `span` property as part of a cell object:
  * Renamed `span` property of a cell object to `columnSpan`.
    * The old name still works but is deprecated.

* If you were using `schema` parameter:
  * Removed `schema` parameter from `writeExcelFile()` function.
    * Instead of `schema` parameter, either use a new `columns` parameter or a new function `getSheetData()`:
      * Using the new `columns` parameter (not same as `schema`):
        * Old: `await writeExcelFile(objects, { schema })`
        * New: `await writeExcelFile(objects, { columns })`
      * Using the new function `getSheetData()`:
        * Old: `await writeExcelFile(objects, { schema })`
        * New: `await writeExcelFile(getSheetData(objects, schema))`
  * In a `schema`, `column` property was renamed to `header`.
    * Old: `[{ column: 'First Name', value: (person) => person.firstName }]`
    * New: `[{ header: 'First Name', value: (person) => person.firstName }]`
  * In a `schema`, `header` property now represents a column header cell, so it can be not just a string but also an object with a `value` property and any optional cell style properties.
    * This means that the header style for each different column can be specified directly in a `schema` entry for that column.
  * In a `schema`, any cell properties such as `value`, `type`, `format`, `fontWeight`, etc were moved to a nested object called `cell`. Specifically, this `cell` property is a function of two arguments — `object` and `objectIndex` — which returns an object with the aforementioned cell properties. And the `value` property is no longer a "getter" function, it's a regular `value`.
  * Previously, it used to apply the default `width: 14` to `type: Date` columns. It no longer does that.
    * Specify the `width` of such columns manually in a `schema`.
  * Removed `getHeaderStyle` parameter from `writeExcelFile()` function.
    * Use the new `header` property on each column in a `schema` to set the style for that column's header cell.
  * Previously, it used to apply bold font to the header row by default. It no longer does that.
    * Use the new `header` property on each column in a `schema` to set the style for that column's header cell.
  * If you were using `getCellStyle()` option:
    * Removed `getCellStyle()` option. It was replaced by the new `cell()` property in a column definition in a `schema`.

* If you were using `features` parameter:
  * The `features` parameter was moved from the second argument to the third argument (in case of a file with a single sheet).
  * If you implemented `file.transform` property of a feature:
    * Changed the first argument of `files.transform.insert()` / `files.transform.transform()` — it's now an array with each separate sheet's options.
    * Changed the second argument of `files.transform.insert()` / `files.transform.transform()`:
      * Removed `multipleSheetsParameters` property because now all sheets' options are separate.
      * Removed `attributeValue()` and `textContent()` properties because they can be imported directly from `write-excel-file/utility` subpackage.
    * Removed `files.transform.parameters()` function. Any sheet options are now available to any feature.
  * If you implemented `files.write` property of a feature:
    * Changed the first argument of `files.write.files()` — it's now an array with each separate sheet's options.
    * Changed the second argument of `files.write.files()`:
      * Removed `multipleSheetsParameters` property because now all sheets' options are separate.
      * Removed `attributeValue()` and `textContent()` properties because they can be imported directly from `write-excel-file/utility` subpackage.
    * Removed `files.write.parameters()` function. Any sheet options are now available to any feature.

* If you were using TypeScript:
  * Renamed some TypeScript types:
    * `ColumnSchema<Object, ValueType>` → `Column<Object>`
    * `Schema` → `Column[]`
    * `ValueType` → `Value`
</details>

## Install

```js
npm install write-excel-file --save
```

Alternatively, it could be included on a web page [directly](#cdn) via a `<script/>` tag.

## Use

The default exported function creates an `.xslx` file from sheet data.

Sheet data must be an array of rows. Each row must be an array of cells. Each cell should be represented by a value — `string`, `number`, `boolean` or `Date` — or be `null` in case it's empty.

Example:

```js
const sheetData = [
  ['A','B','C'], // 1st row
  ['x',123,true], // 2nd row
  ['y',456,false] // 3rd row
]
```

Output file:

| A | B | C |
| - | - | - |
| x | 123 | TRUE |
| y | 456 | FALSE |

Code (Node.js):

```js
import writeExcelFile from 'write-excel-file/node'

await writeExcelFile(sheetData).toFile('/path/to/output-file.xlsx')
```

For some data cells, it might be required to customize their appearance or output format. In that case, a cell could be represented by an object with properties:

* `value` — cell value
* (optional) `type` — cell value type; if not specified, will be derived from `value`
* (optional) [cell options](#cell-options) such as style properties or output `format`

Here's an example where "Amount" column values are displayed as US Dollar currency, and highlighted in yellow where the value exceeds $1000.

```js
[
  ['Order ID', 'Amount'],
  [1, { value: 1234.56, format: '[$$-409]#,##0.00', backgroundColor: '#FFFF00' }],
  [2, { value: 789, format: '[$$-409]#,##0.00' }]
]
```

Output:

| Order ID | Amount |
| - | - |
| 1 | $1,234.56 |
| 2 | $789.00 |

The `type` property of a cell object is optional because it will be automatically derived from the `value` property, or will default to `String` if the `value` is empty or not supported.

Possible `type`:
* `String` — `type: String` and `value: 'Text'`
* `Number` — `type: Number` and `value: 123`
* `Boolean` — `type: Boolean` and `value: true`
* `Date` — `type: Date` and `value: new Date()`
* `'Formula'` — `type: 'Formula'` and `value: '=AVERAGE(A1:A10)'`

And while `sheetData` argument provides the ultimate control and flexibility, most people just need to quickly output a list of JSON objects to an `.xlsx` file, so there's an [easy way](#convert-objects-to-sheet-data) to do so.

## Import

This package provides a separate `import` path for each different environment, as described below.

### Browser

`write-excel-file/browser`

Example 1: Write `sheetData` to a file called `file.xlsx` and trigger a "Save as" file dialog so that the user could save the file to their disk.

```js
import writeExcelFile from 'write-excel-file/browser'

await writeExcelFile(sheetData).toFile('file.xlsx')
```

Example 2: Write `sheetData` to a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).

```js
const blob = await writeExcelFile(sheetData).toBlob()
```

### Node.js

`write-excel-file/node`

Example 1: Write `sheetData` to a file at path `/path/to/output-file.xlsx`.

```js
import writeExcelFile from 'write-excel-file/node'

await writeExcelFile(sheetData).toFile('/path/to/output-file.xlsx')
```

Example 2: Write `sheetData` to a [`Buffer`](https://nodejs.org/api/buffer.html).

```js
const buffer = await writeExcelFile(sheetData).toBuffer()
```

<!--
Example 3: `filePath` parameter is not passed, but `blob: true` parameter is passed, so it returns a [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob).

```js
const blob = await writeExcelFile(sheetData).toBlob()
```
-->

Example 3: Write `sheetData` as a readable [`Stream`](https://nodejs.org/api/stream.html).

```js
const readStream = await writeExcelFile(sheetData).toStream()
```

Example 4: Write `sheetData` to a writable [`Stream`](https://nodejs.org/api/stream.html).

```js
const writeStream = fs.createWriteStream('/path/to/output-file.xlsx')
await writeExcelFile(sheetData).toStream(writeStream)
```

<details>
<summary>AWS S3 could refuse to read from the returned readable stream. Here's a fix.</summary>

#####

AWS S3 might throw `Cannot determine length of [object Object]`:

```js
await new AWS.S3().putObject({
  Bucket: ...,
  Key: ...,
  Body: readStream,
  ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}).promise()
```

The reason is that AWS S3 [only accepts streams of known length](https://github.com/aws/aws-sdk-js/issues/2961), and the length of a `.zip` file can't be known in advance.

Workaround for AWS SDK v2: write `sheetData` to a `Buffer` instead of a `Stream`, and then pass it as `Body`.

Workaround for AWS SDK v3: use [`Upload`](https://github.com/aws/aws-sdk-js/issues/2961#issuecomment-868352176) class from `@aws-sdk/lib-storage` package instead of `PutObjectCommand` from `@aws-sdk/client-s3` package.
</details>

### Universal

`write-excel-file/universal`

This one works both in a web browser and Node.js. It can only write `sheetData` to a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob), which could be a bit less convenient for general use.

```js
import writeExcelFile from 'write-excel-file/universal'

const blob = await writeExcelFile(sheetData).toBlob()
```

## Column Widths

One could set column widths (in "characters" rather than in "pixels") by passing `columns` option:

```js
// Set Column #3 width to "20 characters".
const columns = [
  {},
  {},
  { width: 20 }, // in characters
  {}
]

await writeExcelFile(sheetData, { columns }).toFile(...)
```

## Convert Objects To Sheet Data

Usually, there's a list of `objects` that should be written to an `.xlsx` file.

One could easily convert such `objects` to `sheetData` by passing an additional parameter called `columns` which should describe the list of columns in the output `.xlsx` file.

Each column should be an object with properties:

* (optional) `header` — describes the column header cell
  * Either a string or a cell object
* `cell` — describes each (non-header) cell in this column
  * A function of two arguments — `object` and `objectIndex` — that returns a cell object
* (optional) `width` — column width (in characters)

Example:

```js
// These objects should be written to an `.xlsx` file
const objects = [
  {
    name: 'John Smith',
    dateOfBirth: new Date(Date.UTC(2000, 1 - 1, 5)),
    income: 120000,
    married: true
  },
  {
    name: 'Kate Brown',
    dateOfBirth: new Date(Date.UTC(2005, 4 - 1, 3)),
    income: 60000,
    married: false
  }
]
```

```js
// These columns should be written to the `.xlsx` file
const columns = [
  {
    header: getHeader('Name'),
    cell: (person) => ({
      value: person.name
    }),
    width: 20 // `width` is optional and is measured in characters
  },
  {
    header: getHeader('Date of Birth'),
    cell: (person) => ({
      value: person.dateOfBirth,
      type: Date, // `type` is optional and will be derived from `value`
      format: 'mm/dd/yyyy'
    })
  },
  {
    header: getHeader('Income'),
    cell: (person) => ({
      value: person.income,
      type: Number, // `type` is optional and will be derived from `value`
      format: '#,##0.00'
    })
  },
  {
    header: getHeader('Married'),
    cell: (person) => ({
      value: person.married,
      type: Boolean // `type` is optional and will be derived from `value`
    })
  }
]

// Helper function: creates a header cell object
const getHeader = (text) => ({
  value: text,
  fontWeight: 'bold'
})
```

```js
await writeExcelFile(objects, { columns }).toFile(...)
```

will write the following `sheetData`:

```js
[
  [
    { value: 'Name', fontWeight: 'bold' },
    { value: 'Date of Birth', fontWeight: 'bold' },
    { value: 'Income', fontWeight: 'bold' },
    { value: 'Married', fontWeight: 'bold' }
  ],
  [
    { value: 'John Smith' },
    { value: 2000-01-05T00:00:00.000Z, type: Date, format: 'mm/dd/yyyy' },
    { value: 120000, type: Number, format: '#,##0.00' },
    { value: true, type: Boolean }
  ],
  [
    { value: 'Kate Brown' },
    { value: 2005-04-03T00:00:00.000Z, type: Date, format: 'mm/dd/yyyy' },
    { value: 60000, type: Number, format: '#,##0.00' },
    { value: false, type: Boolean }
  ]
]
```

| Name       | Date of Birth | Income      | Married |
| -----------| ------------- | ----------- | ------- |
| John Smith | 5/1/2000      | $120,000.00 | TRUE    |
| Kate Brown | 4/3/2005      | $60,000.00  | FALSE   |

P.S. Passing `objects` and `columns` is just a shortcut for first using `getSheetData()` function to convert `objects` to `sheetData` and then writing `sheetData` to an `.xlsx` file.

```js
import writeExcelFile, { getSheetData } from 'write-excel-file/node'

// Convert `objects` to `sheetData`.
const sheetData = getSheetData(objects, columns)

// Write `sheetData` to an `.xslx` file.
// Also pass the `columns` here to apply the column `width`.
await writeExcelFile(sheetData, { columns }).toFile(...)
```

## Cell Options

Each cell object could specify:

* Custom [format](#format) property
* Custom [style](#style) properties

### Format

A custom output `format` could be specified for cells with `type`: `Date`, `Number`, `String` or `"Formula"`. Its purpose is to display the "raw" cell value — for example, a number or a date — in a particular way: as a floating-point number with a specific number of decimal places, or as a percentage, or maybe as a date in a particular date format, etc.

<!--
* `formatId: number` — A [built-in](https://xlsxwriter.readthedocs.io/format.html#format-set-num-format) Excel data format ID (like a date or a currency). Example: `4` for formatting `12345.67` as `12,345.67`.
-->

There're many [standardized formats](https://xlsxwriter.readthedocs.io/format.html#format-set-num-format) to choose from.

Below are some of the commonly used `Number` formats.

  * `0.00` — Floating-point number with 2 decimal places. Example: `1234.56`.
  * `0.000` — Floating-point number with 3 decimal places. Example: `1234.567`.
  * `#,##0` — Number with a comma as a thousands separator, as used in most English-speaking countries. Example: `1,234,567`.
  * `#,##0.00` — Currency, as in most English-speaking countries. Example: `1,234.50`.
  * `0%` — Percents. Example: `30%`.
  * `0.00%` — Percents with 2 decimal places. Example: `30.00%`.

All `Date` cells are required to specify a `format`, unless a default [`dateFormat`](#sheet-options) option has been specified.

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

A `String` cell could also specify a `format`.

  * It could specify `@` format in order to explicitly declare itself being of "Text" type rather than the default "General" type. The point is, this way Microsoft Excel won't attempt to "intelligently" interpret the `String` cell value as a number or a date, as it usually does by default. For example, by default, if a `String` cell value is `"123456"`, Microsoft Excel will try to display it as a `123,456` number rather than a `"123456"` string.

### Style

Cell style properties:

* Dimensions
  * `height: number` — Row height, in "points".

* Combine cells
  * `columnSpan: number` — Column span. Specifying `columnSpan: N` will combine a given cell with `N - 1` of the next cells in the same row. Such combined cells will visually appear as a single one when viewing the spreadsheet, but in the `sheetData` structure those cells should still stay separate. In that case, all the cells except the first one will simply be ignored. One could use `null` or `undefined` to represent such ignored cells. For example, if the first cell in a row spans 3 columns, then the row could look like `[{ value: 'Text', columnSpan: 3 }, null, null, { value: 'After text' }]`.

  * `rowSpan: number` — Row span. Specifying `rowSpan: N` will combine a given cell with `N - 1` of the cells below it in the same column. Such combined cells will visually appear as a single one when viewing the spreadsheet, but in the `sheetData` structure those cells should still stay separate. In that case, all the cells except the top one will simply be ignored. One could use `null` or `undefined` to represent such ignored cells. For example, if the top left cell spans 2 rows, then the first row could look like `[{ value: 'A1-A2', rowSpan: 2 }, { value: 'B1' }]` and the second row could look like `[null, { value: 'B2' }]`.

* Alignment

  * `align: string` — Horizontal alignment of cell content. Available values: `"left"`, `"center"`, `"right"`.

  * `alignVertical: string` — Vertical alignment of cell content. Available values: `"top"`, `"center"`, `"bottom"`.

  * `textRotation: number` — Text rotation angle. Values from `-90` to `90` are supported. Positive values rotate the text counterclockwise, and negative values rotate the text clockwise.

  * `indent: number` — Horizontal indentation level for the cell content.

  * `wrap: boolean` — Set to `true` to ["wrap"](https://www.excel-easy.com/examples/wrap-text.html) text when it overflows the cell.

* Font
  * `fontFamily: string` — Can be used to print text in a custom font family. Example: `"Calibri"`.
  * `fontSize: number` — Can be used to print text in a custom font size. Example: `12`.
  * `fontWeight: string` — Can be used to print text in bold. Available values: `"bold"`.
  * `fontStyle: string` — Can be used to make text appear italicized. Available values: `"italic"`.

* Text style
  * `textColor: string` — Cell text color (in hexademical format). Example: `"#aabbcc"`.
  * `textDecoration: object` — Can be used to decorate text.
    * `underline: boolean` — Draws an underline below the text.
    * `doubleUnderline: boolean` — Draws a double underline below the text.
    * `strikethrough: boolean` — Draws a horizontal line through the middle of the text.

* Fill
  * `backgroundColor: string` — Cell background color (in hexademical format). Example: `"#aabbcc"`.
  * `fillPatternStyle: string` — Cell fill pattern style, when a certain fill pattern should be used. Example: `"lightGrid"`.
  * `fillPatternColor: string` — Cell fill pattern color (in hexademical format), when a certain fill pattern should be used. Example: `"#aabbcc"`.

* Border
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

## Sheet Options

The following sheet-specific options could be passed as part of the second argument to `writeExcelFile()` function:

* `sheet: string` — The name of the sheet.
* `columns: object[]` — Column widths.
* `orientation: string` — Sheet orientation. Default is `"portrait"`. Possible values: `"portrait"`, `"landscape"`.
* `dateFormat: string` — Default `format` that will be used for all `Date` cells. Example: `"mm/dd/yyyy"`.
* `stickyRowsCount: number` — Makes a given number of top rows "sticky" (Excel calls them "frozen").
* `stickyColumnsCount: number` — Makes a given number of columns at the start "sticky" (Excel calls them "frozen").
* `showGridLines: boolean` — Pass `false` to hide grid lines.
* `rightToLeft: boolean` — Pass `true` to use right-to-left layout. This is used in right-to-left languages like Arabic.
* `zoomScale: number` — Initial zoom factor. For example, `1.5` would scale the sheet to 150%.

## Global Options

The following options are not specific to any particular sheet and apply to the entire `.xlsx` file:

* `fontFamily: string` — Default font family for all sheets. Example: `"Calibri"`.
* `fontSize: number` — Default font size for all sheets. Example: `11`.
* `features: Feature[]` — Additional third-party ["features"](#features) that may extend the functionality of this package in any custom way.

These options can be passed after any other arguments, i.e. as a third argument when writing a single-sheet file or as a second argument when writing a multi-sheet file.

## Multiple Sheets

To create an `.xlsx` file with multiple sheets, instead of passing `sheetData` as the first argument and `sheetOptions` as the second argument, pass an array of objects of shape `{ data: SheetData, ...options?: SheetOptions }` as the first argument.

```js
await writeExcelFile([
  {
    data: data1,
    sheet: 'Sheet 1',
    columns: columns1,
    stickyRowsCount: 1
  },
  {
    data: data2,
    sheet: 'Sheet 2',
    columns: columns2,
    stickyColumnsCount: 1
  }
]).toFile(...)
```

## Features

This package is quite minimal but at the same time quite extensible by providing custom "feature" implementations.

```js
// Import a TypeScript interface called `Feature`.
import type { Feature } from 'write-excel-file/node'

// This is an implementation of a custom "feature".
// It must implement the `Feature` TypeScript interface.
const myCustomFeature: Feature = {
  ...
}

await writeExcelFile(
  data,
  { sheet: 'Sheet Name' },
  { features: [myCustomFeature] }
).toFile(...)
```

So what can it do?

An `.xlsx` file is really just a `*.zip` archive with the `.zip` file extension renamed to `.xlsx`. If one renames an `*.xslx` file to a `*.zip` file and unpacks it, one could see that it has a certain directory structure and contains certain `*.xml` files. A "feature" implementation could "hook" into creating those `*.xml` files — `xl/styles.xml`, `xl/worksheets/sheet{id}.xml`, etc — to transform their content in any desired way.

<details>
<summary>Read more</summary>

######

Sidenote: When implementing a "feature", one could use the few ["helper" functions](https://gitlab.com/catamphetamine/write-excel-file/-/tree/main/source/xml) that are available for import from `write-excel-file/utility` subpackage (the built-in "features" use these same helper functions):

* `findElement(xml, 'tag')` — Finds a single `<tag/>` element.
* `findElementInsideElement(xml, 'tag', enclosingElement)` — Finds a single `<tag/>` element inside a given element.
* `getChildElements(xml, element)` — Returns all child elements of a given element.
* `getOpeningTagMarkup('tag', { attribute: 'value' })` — Returns XML for an opening `<tag>` with given attributes.
* `getClosingTagMarkup('tag')` — Returns XML for a closing `</tag>`.
* `getSelfClosingTagMarkup('tag', { attribute: 'value' })` — Returns XML for a self-closing `<tag/>` with given attributes.
* `insertElementMarkupAccordingToOrderOfSiblings(xml, elementXml, orderOfSiblings, 'parentTagName1', ...)` — Inserts a given markup of a single element in a given `xml` string at a given "path" of parent element(s) while maintaining a pre-defined of siblings.
  * Use this function whenever inserting a new element in an `.xml` file. The reason is that `.xlsx` file format is extremely sensitive to the order of elements, and maintaining the correct order of siblings is essential to avoid a "corrupt file" error when opening the resulting file in a spreadsheet viewer application.
  * They say that the order of siblings is specified in XML "schemas" (`.xsd` files) in "Part 4" of the [ECMA-376 Office Open XML File Formats](https://en.wikipedia.org/wiki/Office_Open_XML)" specification. I personally didn't even bother checking because this whole "specification" thing already looks needlessly convoluted. Anyway, I asked Google's AI for "xlsx sheet.xml elements order" and it did output some kind of a list — a slightly different one depending on the exact wording — which I used as a loose reference and it seemed to fix those pesky "corrupt file" errors, so you could do the same.
  * Example: `insertElementMarkupAccordingToOrderOfSiblings(xml, '<child1/>', ['child1', 'child2', 'child3'], 'parent1')` will insert `<child1/>` inside the first `<parent1>` element in the `xml` string.
  * Optionally, the insertion "path" could be specified in more detail by passing not just a single parent tag name but a chain of parent tag names. For example, `insertElementMarkupAccordingToOrderOfSiblings(xml, '<child1/>', ['child1', 'child2', 'child3'], 'parent1', 'parent2')` will insert `<child1/>` inside the first `<parent1>` element of the first `<parent2>` element in the `xml` string.
* `getOrderOfSiblings(fileName, 'parentTagName1', ...)` — One could use it to get the `orderOfSiblings` argument for `insertElementMarkupAccordingToOrderOfSiblings()` function.
  * The list of file names or tag names supported by this function is nowhere near complete, so don't rely on it too much. Currently, it only supports 3 file names, and only the top-level tags in those files.
* `replaceElement(xml, element, replacementXml)` — Replaces `element` with a given substring.
* `getMarkupInsideElement(xml, element)` — Returns the XML inside a given `element`.
* `setMarkupInsideElement(xml, element, replacementXml)` — Replaces the XML inside a given `element`.
* `prependMarkupInsideElement(xml, element, addedXml)` — Prepends XML inside a given `element`.
* `appendMarkupInsideElement(xml, element, addedXml)` — Appends XML inside a given `element`.
* `sanitizeAttributeName('attribute')` — "Sanitizes" a string for output as an attribute name. Removes any illegal characters. Escapes any "special" characters.
* `sanitizeAttributeValue('value')` — "Sanitizes" a string for output as an attribute value. Removes any illegal characters. Escapes any "special" characters.
* `sanitizeTextContent('text')` — "Sanitizes" a string for output as text content of an XML element. Removes any illegal characters. Escapes any "special" characters.

For an example of a "feature" implementation see [`./source/xlsx/features`](https://gitlab.com/catamphetamine/write-excel-file/-/tree/main/source/xlsx/features) directory of the code repository. Also see the definition of the `Feature` TypeScript interface in `./index.d.ts` file and also see `./types/features` directory for TypeScript definitions of the built-in "features". Also, see an [example](https://gitlab.com/catamphetamine/write-excel-file/-/blob/main/README_FEATURE_SENSITIVITY_LABEL.md) that adds a "sensitivity label" feature.

The idea is that any "feature" has "raw" unrestricted read/write access to any of the files inside the `.xlsx` file. This means that anything is possible to implement. But it's not necessarily the most convenient way. More likely, implementing a feature will involve manipulating the markup of multiple `.xml` files through juggling with different elements and attributes in order to cover all possible cases, which is gonna feel clunky. But at the end of the day, flexibility outweighs convenience. For me as a "core" maintainer, at least. Potential (questionable) improvements could include adding a "hook" like `transformElementXml(elementXml, elementTagName, xmlFileName, { elementIndex, sheetId }, sheetOptions)`, but that would clutter the code further and I feel like the existing tools are already enough.

If a "feature" needs access to sheet data, simply pass it as an argument to the feature constructor:

```js
await writeExcelFile(
  sheetData, sheetOptions, { features: [feature(sheetData)] }
).toFile('/path/to/output-file.xlsx')
```

P.S. When implementing a "feature", don't rely too much on the `.xlsx` file contents to have any particular shape or form (within reason). For example, don't really assume the XML markup in those files to have a certain fixed shape or to maintain a particular fixed order of elements or their attributes. That's because in future versions of this package, the XML markup inside those `.xml` files may potentially be refactored, with some elements considered "unnecessary" and being removed, or non-previously-existing elements being added by default. This means that `transform` functions shouldn't rely on a particular order of existing elements or attributes to find-and-replace those, nor should they presume any particular elements or attributes to not already exist when adding those, i.e. perhaps they should check before adding, in which case perhaps prefer using `transform` over `insert` (see [`stickyRowsOrColumns`](https://gitlab.com/catamphetamine/write-excel-file/-/blob/main/source/xlsx/features/stickyRowsOrColumns.js) feature code for an example). Analogous, `files.write` functions could use `read()` function to check if a file with such name already exists. And to avoid any potential conflicts when introducing a new "relationship ID", consider using a unique "namespace" so that it looks like `rId-${namespace}-1` rather than just `rId1`.

P.P.S. Also note that the `.xlsx` document specification (officially called "[ECMA-376 Office Open XML File Formats](https://en.wikipedia.org/wiki/Office_Open_XML)") dictates a specific order of each and every XML element, and breaking that order will result in a "corrupt file" error when opening the file in a spreadsheet viewer application.

Summary: This package intentionally offloads any non-essential stuff to custom "features". The reason is to prevent this package from growing into a monster of a software that Excel is. Modularity is the only way to combat complexity. Bend under the pressure of merging "just this one" "small" feature that a particular for-profit company really needs in order to please their bosses and eventually the package turns into an unmaintainable bloated mess. Consider how you even got here — a myriad of feature-complete alternatives exist out there and yet you preferred this one for some reason. The less the "core" is, the less intention I'd have to "abandon" maintaining this software.
</details>

######

Here're some of the third-party features submitted by other developers.

* [`@onparallel/write-excel-file-data-validation`](https://www.npmjs.com/package/@onparallel/write-excel-file-data-validation) — Adds interactive user input "data validation" when editing a spreadsheet: choosing a value from a [pre-defined list](https://www.youtube.com/shorts/9GX3kbfWxj0), restricting a numeric/integer/date/time value to a [certain range](https://www.youtube.com/shorts/pysK1Z0YJNk), adding [text length](https://www.youtube.com/shorts/9leDTxRNUA0) constraints, or validating user input using custom [formulas](https://www.youtube.com/watch?v=bDXQy60BcT4) in "tricky" cases.

## Images

An `.xlsx` file could include images. Images reside in their own layer above any other data in a sheet. Each separate sheet has its own separate layer of images.

<details>
<summary>To add images to a sheet, pass them as <code>images</code> option.</summary>

######

```js
const images = [
  { width: 100, ... },
  { width: 200, ... }
]

await writeExcelFile(sheetData, { images }).toFile(...)
```

An image object should have properties:

* `content` — Image content.
  * Browser: `File` or `Blob` or `ArrayBuffer`.
  * Node: Readable `Stream` or `Buffer` or `Blob`.
* `contentType` — MIME content type of the image. Example: `"image/jpeg"`.
* `width` — Image width, in pixels.
* `height` — Image height, in pixels.
* `dpi` — Image "DPI" (aka "dots per inch").
  * For legacy reasons described in the [document](https://gitlab.com/catamphetamine/write-excel-file/-/blob/main/docs/IMAGES.md#image-dimensions), images in XLSX documents are measured not pixels but in some other weird measurement units. Mapping image pixels to those weird measurement units requires knowing a "DPI" of an image.
  * The usual "DPI" of an image is either `72` or `96`. Both values are equally meaningless. Pick one or the other.
  * To find out an image's DPI in Windows, open file "Properties" and go to "Details" tab. There, it will say "Horizontal resolution" and "Vertical resolution".
  * If, after writing an `.xlsx` file, an image looks too large then try specifying a higher DPI. Conversely, if an image looks too small then try specifying a lower DPI.
* `anchor` — The cell that the image is positioned against. In other words, the image's top left corner is tied to the anchor cell's top left corner.
  * `row` — Cell row number, starting with `1`.
  * `column` — Cell column number, starting with `1`.
* `offsetX` — (optional) Image horizontal offset, in pixels, relative to the anchor cell.
* `offsetY` — (optional) Image vertical offset, in pixels, relative to the anchor cell.
* `title` — (optional) Image title.
* `description` — (optional) Image description.

<!-- The implementation details are described in a [document](https://gitlab.com/catamphetamine/write-excel-file/-/blob/main/docs/IMAGES.md). -->
</details>

## Conditional Formatting

[Conditional Formatting](https://www.w3schools.com/excel/excel_conditional_formatting.php) is an `.xlsx` standard feature that applies a given style to cells that meet a certain condition.

<details>
<summary>To apply conditional formatting to a sheet, pass a list of conditional formatting rules as <code>conditionalFormatting</code> option.</summary>

######

```js
// An example of one conditional formatting rule
const conditionalFormatting = [{
  cellRange: {
    from: {
      row: 2,
      column: 1
    },
    to: {
      row: 3,
      column: 1
    }
  },
  condition: {
    operator: '>',
    value: 100
  },
  style: {
    backgroundColor: '#cc0000'
  }
}]

await writeExcelFile(sheetData, { conditionalFormatting }).toFile(...)
```

A conditional formatting rule is defined by properties:

* `cells` — An object specifying a cell range that the rule could be applied to, i.e. it limits the bounds of the rule.
  * `from` — Top-left cell
  * `to` — Bottom-right cell
  * Each cell is defined by:
    * `row` — Row number (starting from `1`)
    * `column` — Column number (starting from `1`)
* `condition` — An object specifying a condition that has to be met in order for the rule to be applied to a given cell.
  * Matching a cell by its value:
    * Compare to a single `value`:
      * `{ operator: '<', value: 100 }` — Matches any cells having a numeric value less than `100`.
    * Compare to two values — `value` and `value2`:
      * `{ operator: '...', value: 100, value2: 200 }` — Matches any cells having a numeric value between `100` and `200` (inclusive).
    * Available `operator`s: `<`, `>`, `<=`, `>=`, `=`, `!=`, `...`
  * Matching an entire row by a formula:
    * `{ formula: '=$A1="ERROR"' }` — Matches all rows having text `ERROR` in column `A`.
      * This dollar-sign technique is called "Mixed Reference with Fixed Column".
* `style` — An object specifying the cell style to apply to matching cells.
  * Supports a subset of [cell style](#style) properties:
    <!-- * Font family -->
    <!-- * Font size -->
    * Font weight
    * Font style
    * Text decoration
    * Text color
    * Background color
    * Fill
    * Border

P.S. When viewing a spreadsheet, if multiple conditional formatting rules "conflict" over the same cell, only the first rule to match the condition will be applied to that cell.
</details>

## Browser Support

An `.xlsx` file is just a `.zip` archive with an `.xslx` file extension. This package uses [`fflate`](https://www.npmjs.com/package/fflate) for `.zip` compression. See `fflate`'s [browser support](https://www.npmjs.com/package/fflate#browser-support) for further details.

## CDN

To include this library directly via a `<script/>` tag on a page, one can use any npm CDN service, e.g. [unpkg.com](https://unpkg.com) or [jsdelivr.com](https://jsdelivr.com)

```html
<script src="https://unpkg.com/write-excel-file@1.x/bundle/write-excel-file.min.js"></script>

<script>
  writeXlsxFile(data, { fileName: 'file.xlsx' })
</script>
```

<!--
## References

This project was inspired by [`zipcelx`](https://medium.com/@Nopziiemoo/create-excel-files-using-javascript-without-all-the-fuss-2c4aa5377813) package.
-->

<!--
## Babel Runtime Dependency

There's a `@babel/runtime` dependency specified in `package.json`. That dependency is only used in Node.js. Specifically, in `write-excel-file/modules/export/writeExcelFileNode.js` file.

```js
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
```

There, `@babel/runtime` is only used to `import` the "generator"/"regenerator" thing which polyfills `async`/`await` support in older versions of Node.js.

This dependency could be removed if `writeExcelFileNode.js` file was rewritten without the use of `async`/`await`.
-->

## GitHub

On March 9th, 2020, GitHub, Inc. silently [banned](https://medium.com/@catamphetamine/how-github-blocked-me-and-all-my-libraries-c32c61f061d3) my account (erasing all my repos, issues and comments, even in my employer's private repos) without any notice or explanation. Because of that, all source codes had to be promptly moved to GitLab. The [GitHub repo](https://github.com/catamphetamine/write-excel-file) is now only used as a backup (you can star the repo there too), and the primary repo is now the [GitLab one](https://gitlab.com/catamphetamine/write-excel-file). Issues can be reported in any repo.

## License

[MIT](LICENSE)
