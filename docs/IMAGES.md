# Images

This document is a general guideline for implementing the feature in the package, or any other XLSX writer.

## Preface

Adding the ability to insert images in `*.xlsx` files has been requested multiple times.

* https://github.com/catamphetamine/write-excel-file/issues/3
* https://gitlab.com/catamphetamine/write-excel-file/-/issues/17
* https://gitlab.com/catamphetamine/write-excel-file/-/issues/96
* https://stackoverflow.com/questions/40486860/create-an-excel-file-with-a-few-styles-using-client-side-javascript-if-possible/68086665?noredirect=1#comment136555466_68086665

[@Miniontoby](https://gitlab.com/Miniontoby) has submitted a [pull request](https://gitlab.com/catamphetamine/write-excel-file/-/merge_requests/5/) with the implementation of the feature according to this guideline. The code from that pull request was eventually copy-pasted into the main branch with some modifications.

## Input

In XLSX files, images reside in their own isolated layer, above the rest of the content. This means that the "spreadsheet data" structure shouldn't be changed, and images should instead be supplied separately.

The current input format is:

```js
// Without `schema`.
const row1 = [cell1, cell2]
const data = [row1, row2]
await writeXlsxFile(data)

// With `schema`.
const objects = [{ ... }, { ... }]
await writeXlsxFile(objects, { schema })
```

Since images shouldn't be part of `data`, they could be supplied in the `options` argument of the `writeXlsxFile()` function:

```js
// Without `schema`.
const images = [{ ... }, { ... }]
const row1 = [cell1, cell2]
const data = [row1, row2]
await writeXlsxFile(data, { images })

// With `schema`.
const images = [{ ... }, { ... }]
const objects = [{ ... }, { ... }]
await writeXlsxFile(objects, { schema, images })
````

In case of a multi-sheet scenario:

```js
// Without `schema`.
const images1 = [{ ... }, { ... }]
const row1 = [cell1, cell2]
const data1 = [row1, row2]
await writeXlsxFile([data1, data2], {
  images: [images1, images2],
  sheets: ['Sheet 1', 'Sheet 2']
})

// With `schema`.
const images1 = [{ ... }, { ... }]
const objects1 = [{ ... }, { ... }]
await writeXlsxFile([objects1, objects2], {
  schema: [schema1, schema2],
  images: [images1, images2],
  sheets: ['Sheet 1', 'Sheet 2']
})
````

The image object could look like:

```js
{
  // The image data buffer or stream, or a path to an image file.
  content: Node.js (ReadableStream or Buffer or FilesystemPath) or browser (File | Blob),

  // The image data content type.
  // Examples:
  // * "image/jpeg" for `*.jpg` files.
  // * "image/png" for `*.png` files.
  contentType: string,

  // Image width, in pixels.
  width: number,

  // Image height, in pixels.
  height: number,

  // (optional) Title.
  title?: string,

  // (optional) Description.
  description?: string
}
```

In order to position an image on a "sheet", it should be "anchored" to a certain cell:

```js
{
  content,
  contentType,
  width,
  height,

  anchor: {
    // Row number, starting from 1.
    row: number,
    // Column number, starting from 1.
    column: number
  }
}
```

In order to be able to place an image at any coordinates, it should also support "offset" relative to the "anchor" cell:

```js
{
  content,
  contentType,
  width,
  height,

  anchor: {
    row: number,
    column: number
  },

  // Horizontal offset, in pixels.
  offsetX?: number,

  // Horizontal offset, in pixels.
  offsetY?: number
}
```

## Image Dimensions

An image has a size — width and height — that're in "pixels".

Each "pixel" of an image is supposed to be shown as a single "dot" on a computer screen.

For example, if the screen resolution is `800x600` and an image has dimensions of `400x300` then it will occupy exactly `1:4` of the display.

But an image could also be printed. And printers don't have "pixels". Instead, printers have "dots" of paint. And different printers have different "quality" (density) of printing, meaning that each printer has its own "dots per inch" ("DPI") benchmark. Or they could be called "dots per milimeter", if printers were invented outside of the US.

So now there has to be a way of mapping image "pixels" to the output medium's "dots". Each computer monitor could be assigned a DPI according to its currently selected "resolution" and its physical dimensions. Each "pixel" of an image gets mapped onto a separate "pixel" of the computer monitor, meaning that the image itself doesn't have a certain fixed DPI and rather its DPI is determined by context it's being displayed in, i.e. by the computer monitor's "resolution" and physical dimensions.

Sidenote: "DPI" is sometimes also called "PPI" ("points per inch"). For some reason, they like the word "point" more than "dot" or something.

As for printers, each printer now also has its own DPI defined by the manufacturer, and when printing an image, that image's "pixels" get automatically converted to printer "dots" by assuming the image's DPI to be of some "fallback" value of, usually, `72` or `96`, and then the printer's DPI is defined by the manufacturer, yielding certain physical dimensions of the printed image.

Why is the "fallback" DPI of an image assumed to be `72` or `96`? That's for legacy reasons. Since the 1980s, Macs (Apple computers) have set the default display "DPI" to `72`, while the Microsoft Windows operating system has used a default "DPI" of `96` (`72 × 4⁄3 = 96`) because they preferred existing fonts to appear larger on screen for easier viewing without having to resort to scaling those fonts (presumably, "font size" concept didn't exist yet at that time). Having those displays, in order to map image pixels to physical display pixels one-by-one, the default image DPI was also assumed to be `72` or `96`, depending on the Operating System being used to view the image.

Later, "high-density" screens were invented, starting from iPhone 4s's "retina" screen. Those screens had higher DPI (defined by the screen manufacturer), and images were physically two times smaller when displayed on those devices, i.e. they occupied two times less "inches" of the screen area. For that reason, application developers started supplying "2x" versions of images for those "retina" screens. Later screens had even higher DPI. For example, `iPhone 15 Pro` is at `460` "ppi", where "ppi" is "points per inch", which, I assume, is the same as "dots per inch".

So an image itself doesn't have to have a DPI. Even though, historically, older image file formats, such as BMP, GIF or PNG, included a "DPI" parameter inside them, modern image file formats like JPEG by default [don't include a DPI parameter](https://mcwriting.com/2018/10/11/300-dpi-jpeg-no-such-thing/).

But those file formats do allow optionally specifying an image's DPI.

For example, PNG format does have the ability to store `pixels/meter`, separately for the `X` and `Y` axes, in the PNG `pHYs` data chunk. Although, this does not allow exact conversions: `72 dpi` is `2834.64566929` pixels per meter which is stored as `2835` `pixels/meter` and when converted back to DPI becomes `72.009`). Some people find that disturbing.

JPEG also can store `X_density` and `Y_density` parameter values, in units `pixels/inch` or `pixels/cm`.

To view an image's DPI in Windows, open file "Properties" → "Details" → "Horizontal resolution" / "Vertical resolution". There, it will display either the actual DPI or a fallback "dummy" value of `72` or `96`.

## Spreadsheet Dimensions

Historically, spreadsheets were also often printed, so the dimensions of images inside them are not in "pixels" but rather something more exotic, and not even "inches". Spreadsheets measure images in some kind of weird measurement units called [EMUs](https://en.wikipedia.org/wiki/Office_Open_XML_file_formats#DrawingML) (English Metric Units).

> "A DrawingML graphic's dimensions are specified in English Metric Units (EMUs). It is so called because it allows an exact common representation of dimensions originally in either English or metric units—defined as 1/360,000 of a centimeter, and thus there are 914,400 EMUs per inch, and 12,700 EMUs per point, to prevent round-off in calculations."

## How To Get Image Dimensions in EMUs

The short answer: just multiply the pixels count by `9525`.

The long answer:

> "Converting EMU to PX depends on the image density. The conversion factor for 96ppi images is 9525, while for a 72ppi image is 12700 and for a 300ppi image is 3048"

https://stackoverflow.com/questions/20194403/openxml-distance-size-units/71379611#71379611

```js
// "Fallback" display DPI.
const DEFAULT_DISPLAY_DPI = 96

// Parameters:
//
// * `width` — image width in pixels
// * `height` — image height in pixels
//
// Returns:
//
// * `width` — image width in EMUs
// * `height` — image height in EMUs
//
export default function getImageSizeInEmus({
  width,
  height,

  // (optional) (advanced)
  // Image DPI.
  // Could be different along X axis and Y axis,
  // but I guess in practice no one would really use different DPI on different axes.
  dpiX,
  dpiY
}) {
  // Copied from:
  // https://github.com/jmcnamara/XlsxWriter/blob/53d508602a2577aae1cee4854ac46502e0ca645e/xlsxwriter/worksheet.py#L1492

  if (!isNaN(dpiX)) {
  	width *= DEFAULT_DISPLAY_DPI / dpiX
  }

  if (!isNaN(dpiY)) {
  	height *= DEFAULT_DISPLAY_DPI / dpiY
  }

  // Convert pixels to EMUs.
  width = Math.round(width * 9525)
  height = Math.round(height * 9525)

  return { width, height }
}
```

## How to insert an Image in a Spreadsheet

Example `*.xlsx` structure: https://github.com/ReneNyffenegger/about-Office-Open-XML/tree/master/SpreadsheetML/Images

Explanation of a "drawing" XML structure: http://officeopenxml.com/drwPicInSpread-oneCell.php / http://officeopenxml.com/drwPic.php

* Copy all images to `xl/media` folder of the `*.xlsx` file.
  * Each copied image's filename could be changed to `image{numericId}.{contentTypeExtension}`
    * `numericId` could be an "auto-increment" numeric ID.
    * `contentTypeExtension` should be unique to each `contentType`. For example, it could be `contentType.replace('image/', '')`.

* In `[Content_Types].xml` file of the `*.xlsx` file, add the "extensions" for the images' `contentType`s, and also links to "drawing" files — a separate "drawing" file for each different sheet.
  * Each different `contentType` should have a unique file extension.

```xml
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  ...

  <!-- Standard image extensions. -->
  <Default Extension="jpeg" ContentType="image/jpeg"/>
  <Default Extension="png" ContentType="image/png"/>

  <!-- If the image uses some other extension, add a content type for it. -->
  <Default Extension="{imageFileExtension}" ContentType="image/{imageContentType}"/>

  ...

  <!-- (not required?) -->
  <!-- Add this entry for each "drawing". -->
  <!-- A "drawing" is not an "image" but rather "all images used on a particular sheet". -->
  <!-- So there's one "drawing" per every "sheet" that contains images. -->
  <!-- And each "drawing" has a numeric ID. I guess, that could be a sheet ID, for example. -->
  <Override PartName="/xl/drawings/drawing{numericId}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>
```

* In each of the "drawing" files' `.xml.rels` files — `xl/drawings/rels_/drawing{numericId}.xml.rels` — add a "relationship" for each image file.
  * The `rId{numericId}` should be unique within the `.xml.rels` file but not globally across multiple such files.

```xml
<?xml version="1.0" encoding="utf-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId{numericId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image{numericId}.{imageFileExtension}" />
  ...
</Relationships>
```

* For each "drawing", create an `xl/drawings/drawing{numericId}.xml` file.

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xdr:wsDr
  xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"
  xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  <xdr:oneCellAnchor>
    <xdr:from>
      <xdr:col>{achorCellColumnIndex}</xdr:col>
      <xdr:colOff>0</xdr:colOff>
      <xdr:row>{anchorCellRowIndex}</xdr:row>
      <xdr:rowOff>0</xdr:rowOff>
    </xdr:from>

    <xdr:ext cx="{imageWidthInEmus}" cy="{imageHeightInEmus}"/>

    <xdr:pic>
      <xdr:nvPicPr>
        <xdr:cNvPr id="0" name="Picture {numericId}" descr="{imageOriginalFilenameOrEmptyString}"/>
        <xdr:cNvPicPr>
          <!-- Optional XML element. Locks the aspect ratio of the image. -->
          <a:picLocks noChangeAspect="1"/>
        </xdr:cNvPicPr>
      </xdr:nvPicPr>
      <xdr:blipFill>
        <!-- Link to the image. -->
        <a:blip
          xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId{numericId}" cstate="print"/>
        <!-- Allows scaling the image. -->
        <a:stretch>
          <a:fillRect/>
        </a:stretch>
      </xdr:blipFill>
      <xdr:spPr>
        <a:prstGeom prst="rect">
        </a:prstGeom>
      </xdr:spPr>
    </xdr:pic>
    <xdr:clientData/>
  </xdr:oneCellAnchor>
</xdr:wsDr>
```

* Alternatively to `<xdr:oneCellAnchor/>` with `<xdr:from/>`, one could use `<xdr:twoCellAnchor editAs="oneCell">` with `<xdr:from/>` and `<xdr:to/>` to "tie" both the top-left corner and the bottom-right corner of the image to two cells of a spreadsheet, the idea of which seems convenient in order to somehow auto-resize the image so that it automatically fits the given span of rows and columns. However, the behavior of this feature seems extremely clunky because the image's apect ratio become skewed, and there seems to be no way (?) of telling it to both automatically resize itself to those anchors while also preserving its original aspect ratio, analogous to CSS's [`object-fit: contain`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit). Specification of `twoCellAnchor`: http://officeopenxml.com/drwPicInSpread-twoCell.php

* Add the "drawing"'s "relationship" to `worksheets/_rels/sheet{numericId}.xml.rels`
  * The `rId{numericId}` should be unique within the `.xml.rels` file but not globally across multiple such files.

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId{numericId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing{numericId}.xml"/>
</Relationships>
```

* Add the "drawing" in the sheet's file using the `rID{numericId}` value from above. For example, for the first sheet, that would be `worksheets/sheet1.xml`:

```xml
<worksheet>
	...
	<drawing r:id="rId{numericId}"/>
</worksheet>
```