// This file is currently not used anywhere. It's just here for reference.

// The `.xlsx` document format is described in the official specification
// called "ECMA-376 Office Open XML File Formats":
// https://ecma-international.org/publications-and-standards/standards/ecma-376/
// https://en.wikipedia.org/wiki/Office_Open_XML
//
// They say that this standard — specifically, "Part 4" of it —
// includes XML "schemas" (`.xsd` files) which describe the predefined order of all XML elements.
//
// I personally didn't even bother checking because this whole "specification" thing
// already looks needlessly convoluted. Anyway, I asked Google's AI for
// "xlsx sheet.xml elements order" and it did output some kind of a list —
// a slightly different one depending on the exact wording — which I used
// as a loose reference and it seemed to fix those pesky "corrupt file" errors.
//
// For example, `CT_Worksheet` type describes a worksheet document ("sheet.xml"),
// and the corresponding "schema" for it is:
//
// <xs:complexType name="CT_Worksheet">
//   <xs:sequence>
//     <xs:element name="sheetPr" type="CT_SheetPr" minOccurs="0"/>
//     <xs:element name="dimension" type="CT_SheetDimension" minOccurs="0"/>
//     <xs:element name="sheetViews" type="CT_SheetViews" minOccurs="0"/>
//     <xs:element name="sheetFormatPr" type="CT_SheetFormatPr" minOccurs="0"/>
//     <xs:element name="cols" type="CT_Cols" minOccurs="0" maxOccurs="unbounded"/>
//     <xs:element name="sheetData" type="CT_SheetData"/>
//     <xs:element name="sheetProtection" type="CT_SheetProtection" minOccurs="0"/>
//     <xs:element name="mergeCells" type="CT_MergeCells" minOccurs="0"/>
//     <xs:element name="drawing" type="CT_Drawing" minOccurs="0"/>
//   </xs:sequence>
// </xs:complexType>
//
// There're "merged" versions of the specification on the internet
// in a form of 6000-some page documents in `.pdf` format,
// but the one I stumbled upon wasn't even searchable in for some weird reason.
//
// And the official specification seems to be hosted on some weird website
// that doesn't even support "online" browsing, and the download doesn't start.
// Who cares about this whole ancient corporate sh*t anyway.

// type TagName = string
// type OrderOfSiblings = Array<TagName | [TagName, OrderOfSiblings]>
// type FileName = 'xl/workbook.xml' | 'xl/styles.xml' | 'xl/worksheets/sheet{id}.xml'
// type OrderOfSiblingsByFile = Record<FileName, OrderOfSiblings>
// declare const orderOfSiblingsByFile: OrderOfSiblingsByFile
// export default orderOfSiblingsByFile

export default {
	// This is what Google AI returned for a search query: "xlsx workbook.xml elements order".
	// They say, this order is defined in `CT_Workbook` schema of ECMA-376 specification.
	'xl/workbook.xml': [
		['workbook', [
			'workbookPr', // (Workbook Properties)
			'bookViews', // (Book Views)
			'sheets', // (List of sheets)
			'pivotCaches', // (If applicable)
			'definedNames', // (Named ranges)
			'calcPr' // (Calculation properties)
		]]
	],

	// This is what Google AI returned for a search query: "xlsx styles.xml elements order".
	// They say, this order is defined in `CT_Stylesheet` schema of ECMA-376 specification.
	'xl/styles.xml': [
		['styleSheet', [
			'numFmts', // Defines custom number formats.
			'fonts', // Contains font definitions (font name, size, color).
			'fills', // Defines cell background colors/patterns.
			'borders', // Defines cell borders.
			'cellStyleXfs', // Master cell styles (usually style 0 is "Normal").
			'cellXfs', // Actual cell formatting definitions (<xf>) referenced by cells.
			'cellStyles', // Connects named styles to cellStyleXfs.
			'dxfs', // Differential formats (conditional formatting).
			'tableStyles' // Table-specific styles.
		]]
	],

	// This is what Google AI returned for a search query: "xlsx sheet.xml elements order".
	// They say, this order is defined in `CT_Worksheet` schema of ECMA-376 specification.
	'xl/worksheets/sheet{id}.xml': [
		['worksheet', [
			'sheetPr', // Sheet properties (e.g., tab color, filter configurations).
			'dimension', // Defines the range of used cells (e.g., ref="A1:C10").
			'sheetViews', // View settings like freeze panes, zoom level, and whether the sheet is selected.
			'sheetFormatPr', // Default row height and column width properties.
			'cols', // Defines column-specific properties (width, hidden status).
			'sheetData', // (Required) The main container for cell data, rows, and values.
			'sheetCalcPr', // Calculation properties.
			'sheetProtection', // Sheet-level security and locked status.
			'protectedRanges', // Specific ranges that are protected.
			'scenarios', // Worksheet scenarios.
			'autoFilter', // Filter range definitions.
			'sortState', // Current sort information.
			'dataConsolidate', // Data consolidation settings.
			'customSheetViews', // Custom view settings.
			'mergeCells', // Defines ranges of merged cells.
			'phoneticPr', // Phonetic information properties.
			'conditionalFormatting', // Rules for formatting based on cell values.
			'dataValidations', // Data entry rules and dropdowns.
			'hyperlinks', // Links to external sites or other sheet locations.
			'printOptions', // Defines specific printing preferences, such as centering, gridlines, and headings.
			'pageMargins', // Defines the white space between the worksheet data and the edges of the printed page.
			'pageSetup', // Printing and layout settings.
			'headerFooter', // Sheet header and footer content.
			'rowBreaks', // Manual page breaks.
			'colBreaks', // Manual page breaks.
			'drawing', // References to graphics or charts (points to drawing.xml).
			'legacyDrawing', // References to legacy objects like comments or form controls.
			'picture', // Background image properties.
			'oleObjects', // Embedded OLE objects.
			'controls', // Form or ActiveX controls.
			'tableParts', // Links to defined Excel tables within the sheet.
			'extLst' // Extension list for future-proofing and custom metadata.
		]]
	]
}