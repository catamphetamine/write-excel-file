import $attributeValue from '../../xml/escapeAttributeValue.js'
import getXlsxColorForHexColor from './getXlsxColorForHexColor.js'

export default function getFontXml(font, { isDefaultGenericFont } = {}) {
	const {
		fontFamily,
		fontSize,
		fontWeight,
		fontStyle,
		textDecoration,
		textColor
	} = font

	let xml = '<font>'

	// Apply `fontFamily`
	if (fontFamily) {
		// `<name/>` element specifies the actual typeface name, such as "Calibri" or "Arial".
		xml += `<name val="${$attributeValue(fontFamily)}"/>`
	}

	// Apply `fontSize`
	if (typeof fontSize === 'number') {
		xml += `<sz val="${fontSize}"/>`
	}

	// `<family/>` element specifies a generic font family classification, which is used
	// by the application's font substitution logic if the exact font name is unavailable.
	// The `val` attribute uses a numerical value corresponding to a generic family:
	// 0: Automatic
	// 1: Roman (serif typefaces, like Times New Roman)
	// 2: Swiss (sans-serif typefaces, like Arial or Calibri)
	// 3: Modern (typefaces with a consistent stroke width, often monospaced)
	// 4: Script (handwriting or calligraphy style)
	// 5: Decorative (display typefaces)
	xml += '<family val="2"/>'

	// When no custom font family or size are specified,
	// it uses a default generic font.
	if (!(fontFamily || typeof fontSize === 'number')) {
		// Specifies that a font belongs to the theme's "minor" (body) category,
		// mapping it to the default paragraph/body font. It enables automatic font updates
		//  when changing themes, separating it from "major" (heading) fonts.
		xml += '<scheme val="minor"/>'
	}

	// Apply `fontWeight`
	if (fontWeight === 'bold') {
		xml += '<b/>'
	}

	// Apply `fontStyle`
	if (fontStyle === 'italic') {
		xml += '<i/>'
	}

	// Apply `textDecoration`
	if (textDecoration) {
		if (textDecoration.strikethrough) {
			xml += '<strike/>'
		}
		if (textDecoration.underline) {
			xml += '<u/>'
		} else if (textDecoration.doubleUnderline) {
			xml += '<u val="double"/>'
		}
	}

	// Sidenote: "subscript" and "superscript" text styles
	// don't seem to work with "conditional formatting" feature.
	//
	// if (... === 'subscript') {
	// 	xml += '<vertAlign val="subscript"/>'
	// } else if (... === 'superscript') {
	// 	xml += '<vertAlign val="superscript"/>'
	// }

	// Apply `textColor`
	if (textColor) {
		xml += `<color rgb="${$attributeValue(getXlsxColorForHexColor(textColor))}"/>`
	} else {
		// In XLSX files, `theme="1"` for font color typically refers to the first color
		// in the document's theme palette, which is usually "light-1" (white or very light grey)
		// or "dark-1" (black or very dark grey) depending on the background theme,
		// designed to contrast with the default background color.
		//
		// It is part of the XML structure in XLSX files that defines theme-based colors
		// rather than hardcoded RGB values, allowing for dynamic updates when changing themes in Excel.
		//
		// It is generally used to define the primary text color (e.g., black on white) for default styling.
		//
		xml += '<color theme="1"/>'
	}

	xml += '</font>'

	return xml
}