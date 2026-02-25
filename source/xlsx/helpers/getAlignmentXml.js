import $attributeValue from '../../xml/sanitizeAttributeValue.js'

export default function getAlignmentXml({
	align,
	alignVertical,
	textRotation,
	indent,
	wrap
}) {
	return '<alignment' +
		(align ? ` horizontal="${$attributeValue(align)}"` : '') +
		(alignVertical ? ` vertical="${$attributeValue(alignVertical)}"` : '') +
		(textRotation ? ` textRotation="${getTextRotation(validateTextRotation(textRotation))}"` : '') +
		(indent ? ` indent="${$attributeValue(String(indent))}"` : '') +
		(wrap ? ` wrapText="1"` : '') +
		'/>'
}

// Validates text rotation parameter value.
// Text rotation parameter value could be from -90 to 90.
// Positive values rotate the text counterclockwise, and negative values rotate the text clockwise.
//
// The spec-compliant `textRotation` parameter value is weird.
// See `getTextRotation()` function comments.
//
// I've searched the internet on how other libraries expect text rotation parameter to look like.
// The consensus seems to be "-90...90" so that it's not as weird as the official spec defines it.
//
// In ClosedXML .NET library, it allows the values from -90 to 90:
// https://docs.closedxml.io/en/latest/features/cell-format.html#orientation
//
// In XlsxWriter Python library, it's -90 to 90 with 270 as a special magic value:
// https://xlsxwriter.readthedocs.io/format.html#format-set-rotation
//
// In Apache POI, it's also -90 to 90 and 255 as a special magic value:
// https://copyprogramming.com/howto/how-to-rotate-text-in-a-spreadsheet-cell-using-apache-poi
//
// "Specify the angle of rotation for the text within the cell.
//  The degree of rotation can range between -90 and 90 degrees, or it can be set to 0xff for vertical alignment."
//
// So -90 to 90 seems like a common-practice value range.
//
function validateTextRotation(textRotation) {
  if (!(textRotation >= -90 && textRotation <= 90)) {
    throw new Error(`Unsupported text rotation angle: ${textRotation}. Values from -90 to 90 are supported.`);
  }
  return textRotation
}

// Transforms `textRotation` parameter value to the spec-compliant form.
//
// The XLSX specification for the value of `textRotation` is weird:
// https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.alignment?view=openxml-2.8.1
//
// "Text rotation in cells. Expressed in degrees. Values range from 0 to 180.
//  The first letter of the text is considered the center-point of the arc.
//  For 0 - 90, the value represents degrees above horizon.
//  For 91-180 the degrees below the horizon is calculated as:
//  [degrees below horizon] = 90 - textRotation"
//
function getTextRotation(textRotation) {
  if (textRotation < 0) {
    return 90 - textRotation
  }
  return textRotation
}