# Images

There have been requests of adding the ability to insert images in `*.xlsx` files.

* https://github.com/catamphetamine/write-excel-file/issues/3
* https://gitlab.com/catamphetamine/write-excel-file/-/issues/17
* https://stackoverflow.com/questions/40486860/create-an-excel-file-with-a-few-styles-using-client-side-javascript-if-possible/68086665?noredirect=1#comment136555466_68086665

## Image Dimensions

An image has a size. It's in pixels: width and height.

Historically, images were often printed, so image file formats, such as BMP, GIF or PNG, include a "DPI" setting inside them.

More modern file formats, such as JPEG, [don't include a DPI](https://mcwriting.com/2018/10/11/300-dpi-jpeg-no-such-thing/).

## Display DPI

Computer displays have a DPI which is "dots per inch", where a "dot" is an RGB pixel. The default value for computer displays is `96`.

Mobile phones have higher DPI. For example, `iPhone 15 Pro` is at `460` "ppi", where "ppi" is "points per inch", which, I assume, is the same as "dots per inch".

## Spreadsheet Dimensions

Historically, spreadsheets were also often printed, so the dimensions of images inside them are not in pixels, and not even in "points" or "inches", but rather in weird measurement units called [EMUs](https://en.wikipedia.org/wiki/Office_Open_XML_file_formats#DrawingML) (English Metric Units).

> "A DrawingML graphic's dimensions are specified in English Metric Units (EMUs). It is so called because it allows an exact common representation of dimensions originally in either English or metric units—defined as 1/360,000 of a centimeter, and thus there are 914,400 EMUs per inch, and 12,700 EMUs per point, to prevent round-off in calculations."

## Get Image Dimensions in EMUs

> "Converting EMU to PX depends on the image density. The conversion factor for 96ppi images is 9525, while for a 72ppi image is 12700 and for a 300ppi image is 3048"

https://stackoverflow.com/questions/20194403/openxml-distance-size-units/71379611#71379611

```js
// Copied from:
// https://github.com/jmcnamara/XlsxWriter/blob/53d508602a2577aae1cee4854ac46502e0ca645e/xlsxwriter/worksheet.py#L1492

// Get image `width` and `height` in pixels.
// Could also read the DPI setting from the image.
const {
	width,
	height,
	dpiX = 96,
	dpiY = 96
} = readImageData(image)

// (optional) Scale the image.
// width *= scaleX
// height *= scaleY

// The default display DPI.
const DEFAULT_DISPLAY_DPI = 96

if (dpiX) {
	width *= DEFAULT_DISPLAY_DPI / dpiX
}

if (dpiY) {
	height *= DEFAULT_DISPLAY_DPI / dpiY
}

// Convert from pixels to EMUs.
width = Math.round(width * 9525)
height = Math.round(height * 9525)
```

## Inserting an Image in a Spreadsheet

Example `*.xlsx` structure: https://github.com/ReneNyffenegger/about-Office-Open-XML/tree/master/SpreadsheetML/Images

Explanation of a "drawing" XML structure: http://officeopenxml.com/drwPicInSpread-oneCell.php / http://officeopenxml.com/drwPic.php

* Add an "extension" for the image in `[Content_Types].xml`

```xml
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  ...

  <Default Extension="jpeg" ContentType="image/jpeg"/>
  <Default Extension="jpg" ContentType="image/jpg"/>
  <Default Extension="png" ContentType="image/png"/>
  <Default Extension="{imageFileExtension}" ContentType="image/{imageContentType}"/>
  ...

  <Override PartName="/xl/drawings/drawing{numericId}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>
```

* Add a "relationship" for the image in `xl/drawings/rels_/drawing{numericId}.xml.rels`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId{numericId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image{numericId}.{imageFileExtension}" />
</Relationships>
```

* Create `xl/drawings/drawing{numericId}.xml`

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xdr:wsDr
  xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"
  xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  <xdr:oneCellAnchor>
    <xdr:from>
      <xdr:col>{columnIndex}</xdr:col>
      <xdr:colOff>0</xdr:colOff>
      <xdr:row>{rowIndex}</xdr:row>
      <xdr:rowOff>0</xdr:rowOff>
    </xdr:from>

    <xdr:ext cx="{imageWidthInEmus}" cy="{imageHeightInEmus}"/>

    <xdr:pic>
      <xdr:nvPicPr>
        <xdr:cNvPr id="0" name="Picture {numericId}" descr="{imageOriginalFilenameOrEmptyString}"/>
        <xdr:cNvPicPr>
        </xdr:cNvPicPr>
      </xdr:nvPicPr>
      <xdr:blipFill>
        <a:blip
          xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId{numericId}" cstate="print"/>
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

* Copy the image file to `xl/media/image{numericId}.{imageFileExtension}`

* Add the drawing's "relationship" to `worksheets/_rels/sheet{numericId}.xml.rels`

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId{numericId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing{numericId}.xml"/>
</Relationships>
```

* Add the drawing in the sheet's file. For example, in `worksheets/sheet1.xml`.

```xml
<worksheet>
	...
	<drawing r:id="rId{numericId}"/>
</worksheet>
```

## Implementation Notes

* Some parts have been implemented:
  * TypeScript support for `type: "Image"`.
  * README:
    * `## Images` section.
    * `* "Image"` value in description of `type` property.

* Since it has to include the physical image file in the `*.xlsx` archive, it should be passed:
  * On client: as a `File` or as a `Blob`.
    * I guess the `Blob` doesn't have a filename, but it's optional anyway, and otherwise those two seem to be equal because `File` class extends `Blob` class.
  * On server: as a `String` path, or as a `Buffer`, or as a `Blob`.
    * That would be analogous to how [`read-excel-file`](https://gitlab.com/catamphetamine/read-excel-file) supports the input being one of those types, so the input handling code could be copypasted from it, along with the TypeScript "typings".
    * I guess a `Buffer` doesn't have a filename, but it's optional anyway.