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

## Install

```js
npm install write-excel-file --save
```

Alternatively, one could include it on a web page [directly](#cdn) via a `<script/>` tag.

## Use

The default exported function — let's call it `writeExcelFile()` — creates an `.xslx` file from sheet data.

```js
await writeExcelFile(data, { filePath: '/path/to/file.xlsx' })
```

Sheet data must be an array of rows. Each row must be an array of cells. Each cell should be represented by a value — `string`, `number`, `boolean` or `Date` — or be `null` in case it's empty.

Example:

```js
const data = [
  ['A','B','C'], // 1st row
  ['x',123,true], // 2nd row
  ['y',456,false] // 3rd row
]
```

Output:

| A | B | C |
| - | - | - |
| x | 123 | TRUE |
| y | 456 | FALSE |

A cell could also be represented by an object with properties: `value`, (optional) `type`, and, optionally, other [cell parameters](#cell-parameters) such as style or a specific `format`:

```js
[
  ['Order ID', 'Amount'],
  [1, { value: 1234.56, format: "[$$-409]#,##0.00" }],
  [2, { value: 789, format: "[$$-409]#,##0.00" }]
]
```

Output:

| Order ID | Amount |
| - | - |
| 1 | $1,234.56 |
| 2 | $789.00 |

The aforementioned `type` property is optional because it is automatically detected from the `value` property, or defaults to `String` if the `value` is empty or not supported.

Possible `type`:
* `String`
* `Number`
* `Boolean`
* `Date`
* `"Formula"`

## API

### Browser

Example 1: Write `data` to a file called `file.xlsx` and trigger a "Save as" file dialog so that the user could save the file to their disk.

```js
import writeExcelFile from 'write-excel-file/browser'

await writeExcelFile(data, {
  fileName: 'file.xlsx'
})
```

Example 2: `fileName` parameter is not passed, so it returns a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).

```js
const blob = await writeExcelFile(data)
```

### Node.js

Example 1: Write `data` to a file at path `/path/to/file.xlsx`.

```js
import writeExcelFile from 'write-excel-file/node'

await writeExcelFile(data, {
  filePath: '/path/to/file.xlsx'
})
```

Example 2: `filePath` parameter is not passed, but `buffer: true` parameter is passed, so it returns a [`Buffer`](https://nodejs.org/api/buffer.html).

```js
const buffer = await writeExcelFile(data, { buffer: true })
```

<!--
Example 3: `filePath` parameter is not passed, but `blob: true` parameter is passed, so it returns a [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob).

```js
const blob = await writeExcelFile(data, { blob: true })
```
-->

Example 3: Neither `filePath` nor `buffer: true` <!-- nor `blob: true` --> parameters are passed, so it returns a readable [`Stream`](https://nodejs.org/api/stream.html).

```js
const readStream = await writeExcelFile(data)
const writeStream = fs.createWriteStream('/path/to/file.xlsx')
readStream.pipe(writeStream)
```

<details>
<summary>AWS S3 could refuse to read from the returned stream. Here's a fix.</summary>

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

### Universal

The one that works both in a web browser and Node.js. Only supports returning a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob), which could be a bit less convenient for some.

```js
import writeExcelFile from 'write-excel-file/universal'

// outputs a `Blob`.
const blob = await writeExcelFile(data)
```

## Data vs Objects

Alternatively, instead of providing `data`, one could provide a list of JSON `objects` and a `schema` describing each output column:

```js
// Input data
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
// Output columns
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

Each column should have a `column` title, a data `type`, a `value` "getter" function, and, optionally, other [cell parameters](#cell-parameters).

### Browser

```js
import writeExcelFile from 'write-excel-file/browser'

await writeExcelFile(objects, {
  schema,
  fileName: 'file.xlsx'
})
```

### Node.js

```js
import writeExcelFile from 'write-excel-file/node'

await writeExcelFile(objects, {
  schema,
  filePath: '/path/to/file.xlsx'
})
```

## Column Widths

One could specify custom column widths (in "characters" rather than in "pixels").

### When Passing Objects

When passing `objects`/`schema`, column widths can be specified via `width` property in the `schema`.

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

### When Passing Data

When passing `data`, one can pass a separate `columns` parameter to specify column widths:

```js
// Set Column #3 width to "20 characters".
const columns = [
  {},
  {},
  { width: 20 }, // Width is in characters
  {}
]

await writeExcelFile(data, {
  columns, // Pass it here.
  fileName: 'file.xlsx'
})
```

## Cell Parameters

<!--
There're also some additional exported `type`s available:

* `Integer` for integer `Number`s.
* `URL` for URLs.
* `Email` for email addresses.
-->

Regardless of whether you're passing `data` or `objects`/`schema`, each cell (or schema column) can also specify:

* Custom [format](#format) — by specifying a `format` property.
* Custom [style](#style)
  * By specifying any of the style-related properties.
  * (only when passing `objects`/`schema`) By specifying a `getCellStyle(object)` function for a column in the `schema`, which will define the style of each different cell in the given column (except header).

### Format

The optional `format` property can only be used on cells (or schema columns) with `type`: `Date`, `Number`, `String` or `"Formula"` <!-- or `Integer` -->. Its purpose is to display the "raw" cell value — for example, a number or a date — in a particular way: as a floating-point number with a specific number of decimal places, or as a percentage, or maybe as a date in a particular date format, etc.

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

All `Date` cells (or schema columns) are required to specify a `format`, unless a [default `dateFormat`](#date-format) option is specified.

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

A `String` cell (or schema column) could also specify a `format`.

  * It could specify `@` format in order to explicitly declare itself being of "Text" type rather than the default "General" type. The point is, this way Microsoft Excel won't attempt to "intelligently" interpret the `String` cell value as a number or a date, as it usually does by default. For example, by default, if a `String` cell value is `"123456"`, Microsoft Excel will try to display it as a `123,456` number rather than a `"123456"` string.

### Style

Cell style properties:

* Dimensions
  * `height: number` — Row height, in "points".

* Combine cells
  * `span: number` — Column span. Even if a cell spans `N` columns, it should still be represented as `N` individual cells in the `data`. In that case, all the cells except the left-most one will be ignored. One could use `null` or `undefined` to represent such ignored cells. For example, if the first cell in a row spans 3 columns, then the row would look like `[{ value: 'Text', span: 3 }, null, null, { value: 'After text' }]`.

  * `rowSpan: number` — Row span. Even if a cell spans `N` rows, it should still be represented as `N` individual cells in the `data`. In that case, all the cells except the top-most one will be ignored. One could use `null` or `undefined` to represent such ignored cells. For example, if the top left cell spans 2 rows, then the first row would look like `[{ value: 'Rows', rowSpan: 2 }, { value: 'R1' }]` and the second row would look like `[null, { value: 'R2' }]`.

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

## Options

The following options could be passed as part of the second argument to `writeExcelFile()` function:

* `sheet: string` — Sets the name of the sheet.
* `fontFamily: string` — Sets the default font family. Example: `"Calibri"`.
* `fontSize: number` — Sets the default font size. Example: `12`.
* `orientation: string` — Sets the orientation for all sheets. Default is `"portrait"`. Possible values: `"portrait"`, `"landscape"`.
* `dateFormat: string` — Sets the default format for outputting dates. Example: `"mm/dd/yyyy"`.
* `stickyRowsCount: number` — Makes a given number of top rows "sticky" (Excel calls them "frozen").
* `stickyColumnsCount: number` — Makes a given number of columns at the start "sticky" (Excel calls them "frozen").
* `showGridLines: boolean` — Pass `false` to hide grid lines.
* `rightToLeft: boolean` — Pass `true` to use right-to-left layout on all sheets.
* `zoomScale: number` — Sets the initial zoom factor. Example: `1.5` scales the document to 150%.

## Multiple Sheets

### When Passing Objects

To generate an `.xlsx` file with multiple sheets when passing `objects`/`schema`:

* Pass a `sheets` parameter — an array of sheet names.
* The `objects` argument should be an array of `objects` for each sheet.
* The `schema` parameter should be an array of `schema`s for each sheet.

```js
await writeExcelFile([objects1, objects2], {
  schema: [schema1, schema2],
  sheets: ['Sheet 1', 'Sheet 2'],
  filePath: '/path/to/file.xlsx'
})
```

### When Passing Data

To generate an `.xlsx` file with multiple sheets when passing `data`:

* Pass a `sheets` parameter — an array of sheet names.
* The `data` argument should be an array of `data` for each sheet.
* (optional) The `columns` parameter should be an array of `columns` for each sheet.

```js
await writeExcelFile([data1, data2], {
  columns: [columns1, columns2], // (optional)
  sheets: ['Sheet 1', 'Sheet 2'],
  filePath: '/path/to/file.xlsx'
})
```

## Table Header Style When Passing Objects

When passing `objects`/`schema`, the output table will include a header row at the top. The header row can be customized by providing column titles and cell style.

Column titles should be specified as `column` property values in the `schema`.

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

When `column` title is not specified, it's gonna be empty.

The default style for table header cells is:
* `fontWeight` — `"bold"`
* `align` — equal to the `schema` column's `align` property value

To override that default style, provide a `getHeaderStyle(columnSchema)` function:

```js
await writeExcelFile(objects, {
  schema,
  getHeaderStyle: (columnSchema) => ({
    backgroundColor: '#eeeeee',
    fontWeight: 'bold',
    align: columnSchema.align,
    indent: columnSchema.indent
  }),
  filePath: '/path/to/file.xlsx'
})
```

## Features

This package is quite minimal but at the same time extensible by providing custom "feature" implementations.

```js
// TypeScript "definition" of a "feature".
import type { Feature } from 'write-excel-file/node'

import writeExcelFile from 'write-excel-file/node'

// A custom feature should implement the `Feature` TypeScript interface.
const myCustomFeature: Feature = {
  ...
}

await writeExcelFile(data, {
  fileName: 'file.xlsx',
  features: [myCustomFeature]
})
```

A `.xlsx` file is really just a `*.zip` archive with the `.zip` file extension renamed to `.xlsx`. If one renames an `*.xslx` file to a `*.zip` file and unpacks it, one could see that it has a certain directory structure and contains certain `*.xml` files. A "feature" implementation could "hook" into creating those `*.xml` files — `xl/styles.xml`, `xl/worksheets/sheet{id}.xml`, etc — to transform their content in any desired way.

Sidenote: When doing that, one could use the few ["helper" functions](https://gitlab.com/catamphetamine/write-excel-file/-/tree/main/source/xml) available for import from `write-excel-file/utility` subpackage: `findElement()`, `findElements()`, `findElementInsideElement()`, `findElementsInsideElement()`, `getOpeningTagMarkup()`, `getClosingTagMarkup()`, `getSelfClosingTagMarkup()`, `replaceElement()`, `getMarkupInsideElement()`, `setMarkupInsideElement()`, `prependMarkupInsideElement()`, `appendMarkupInsideElement()`, `escapeAttributeName()`, `escapeAttributeValue()`, `escapeTextContent()`.

For an example of a "feature" implementation see [`./source/xlsx/features`](https://gitlab.com/catamphetamine/write-excel-file/-/tree/main/source/xlsx/features) directory of the code repository. Also see the definition of the `Feature` TypeScript interface in `./index.d.ts` file and see `./types/features` directory for TypeScript definitions of "features". Also, see an [example](https://gitlab.com/catamphetamine/write-excel-file/-/blob/main/README_FEATURE_SENSITIVITY_LABEL.md) that adds a "sensitivity label" feature.

P.S. When implementing a "feature", don't rely too much on the `.xlsx` file contents to have any particular shape or form (within reason). For example, don't really assume the XML markup in those files to have a certain fixed shape or to maintain a particular fixed order of elements or their attributes. That's because in future versions of this package, the XML markup inside those `.xml` files may potentially be refactored, with some elements considered "unnecessary" and being removed, or non-previously-existing elements being added by default. This means that `transform` functions shouldn't rely on a particular order of existing elements or attributes to find-and-replace those, nor should they presume any particular elements or attributes to not already exist when adding those, i.e. perhaps they should check before adding, in which case perhaps prefer using `transform` over `insert` (see [`stickyRowsOrColumns`](https://gitlab.com/catamphetamine/write-excel-file/-/blob/main/source/xlsx/features/stickyRowsOrColumns.js) feature code for an example). Analogous, `files.write` functions could use `read()` function to check if a file with such name already exists. And to avoid any potential conflicts when introducing a new "relationship ID", consider using a unique "namespace" so that it looks like `rId-${namespace}-1` rather than just `rId1`.

## Images

Images reside in their own layer above any other data on a spreadsheet. Each separate sheet has its own layer of images.

To add images to a sheet, pass them as an `images` parameter to `writeExcelFile()` function:

```js
const images = [{ ... }, { ... }]

// When passing `data`.
await writeExcelFile(data, { images })

// When passing `objects`/`schema`.
await writeExcelFile(objects, { schema, images })
```

When an `.xlsx` file is written with multiple sheets, each separate sheet should specify its own `images`.

```js
const images1 = [{ ... }, { ... }]
const images2 = [{ ... }, { ... }]

// When passing `data`.
await writeExcelFile([data1, data2], {
  images: [images1, images2],
  sheets: ['Sheet 1', 'Sheet 2']
})

// When passing `objects`/`schema`.
await writeExcelFile([objects1, objects2], {
  schema: [schema1, schema2],
  images: [images1, images2],
  sheets: ['Sheet 1', 'Sheet 2']
})
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

The implementation details are described in a [document](https://gitlab.com/catamphetamine/write-excel-file/-/blob/main/docs/IMAGES.md).

## Conditional Formatting

Conditional formatting could be specified by passing a list of conditional formatting rules as `conditionalFormatting` parameter. When multiple rules apply to the same cell, the first one of them has the priority.

```js
import writeExcelFile from 'write-excel-file'

await writeExcelFile(data, {
  fileName: 'file.xlsx',
  conditionalFormatting: [{
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
})
```

A conditional formatting rule is defined by properties:

* `cells` — an object specifying a cell range defined by a `from` cell and a `to` cell
  * `row` is a row number (starting from `1`)
  * `column` is a column number (starting from `1`)
* `condition` — an object specifying a condition
  * Cell value comparison:
    * Comparison to `value`: `{ operator: '<', value: 100 }`
    * Between `value` and `value2`: `{ operator: '...', value: 100, value2: 200 }`
    * Available `operator`s: `<`, `>`, `<=`, `>=`, `=`, `!=`, `...`
  * Custom formula: `{ formula: '=$A1="Complete"' }`
* `style` — an object specifying a style to apply
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

## Browser Support

An `.xlsx` file is just a `.zip` archive with an `.xslx` file extension. This package uses [`fflate`](https://www.npmjs.com/package/fflate) for `.zip` compression. See `fflate`'s [browser support](https://www.npmjs.com/package/fflate#browser-support) for further details.

## CDN

To include this library directly via a `<script/>` tag on a page, one can use any npm CDN service, e.g. [unpkg.com](https://unpkg.com) or [jsdelivr.com](https://jsdelivr.com)

```html
<script src="https://unpkg.com/write-excel-file@1.x/bundle/write-excel-file.min.js"></script>

<script>
  writeXlsxFile(objects, schema, {
    fileName: 'file.xlsx'
  })
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
