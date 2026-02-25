import { CommonStyleProperties } from './common.d.js'

import { ConditionalFormattingParametersSingleSheet, ConditionalFormattingParametersMultipleSheets } from './features/conditionalFormatting.d.js'
import { ImagesParametersSingleSheet, ImagesParametersMultipleSheets } from './features/images.d.js'
import { StickyRowsOrColumnsOptions } from './features/stickyRowsOrColumns.d.js'

// Some users have requested exporting `ValueType` type.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/30
export type ValueType =
	String |
	Date |
	Number |
	Boolean;

// A way to define a `type = String` or `type = Number` variable in TypeScript
// is by defining it as `type: StringConstructor` or `type: NumberConstructor`.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/4#note_715204034
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
type Constructor<Type> =
	Type extends String
		? StringConstructor
		: Type extends Date
			? DateConstructor
			: Type extends Number
				? NumberConstructor
				: Type extends Boolean
					? BooleanConstructor
					: never;

type CellType<ValueType> = Constructor<ValueType> | 'Formula';

interface CellStyle extends CommonStyleProperties {
	align?: 'left' | 'center' | 'right';
	alignVertical?: 'top' | 'center' | 'bottom';
	height?: number;
	span?: number;
	rowSpan?: number;
	indent?: number;
	wrap?: boolean;
	textRotation?: number;
}

interface CellProps extends CellStyle {
	// Data output format (for numbers or dates or strings).
	format?: string;
}

interface CellObjectOfType<ValueType> extends CellProps {
	// Cell value.
	value?: ValueType;
	// Cell value type.
	type?: CellType<ValueType>;
}

export interface CellObject extends CellObjectOfType<ValueType> {}

export type Cell = CellObject | ValueType | null | undefined;
export type Row = Cell[];
export type SheetData = Row[];

// Some users have requested exporting `ColumnSchema` type.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/30
export interface ColumnSchema<Object, ValueType> extends CellProps {
	// Column title.
	column?: string;
	// Column width (in characters).
	width?: number;
	// Cell style getter.
	getCellStyle?(object: Object): CellStyle | undefined;
	// Cell value getter.
	value(object: Object): ValueType | undefined | null;
	// Cell value type.
	type?: CellType<ValueType>;
}

export type Schema<Object> = ColumnSchema<Object, ValueType>[];

type Column = {
	width?: number;
};

type Orientation = 'landscape';

export type Columns = Column[];

export interface CommonOptions<FileContent> extends StickyRowsOrColumnsOptions {
	fontFamily?: string;
	fontSize?: number;
	orientation?: Orientation;
	showGridLines?: boolean;
	rightToLeft?: boolean;
	zoomScale?: number;
	dateFormat?: string;
	features?: Feature<FileContent>[];
}

export interface AdditionalOptionsWhenUsingSchema<Object = never> {
	// Returns a style for the header row when using a `schema` to output a list of objects.
	getHeaderStyle?: (columnSchema: ColumnSchema<Object, ValueType>) => CellStyle | undefined;
}

interface FeatureTransformFileInterface<FeatureTransformFileOptions, Parameters = Record<string, any>> {
	// Inserts XML markup inside the root element (at its end).
	insert?: (
		parameters: Parameters,
		options: FeatureTransformFileOptions
	) => string | undefined;

	// Transforms XML markup.
	transform?: (
		content: string,
		parameters: Parameters,
		options: FeatureTransformFileOptions
	) => string;

	// These parameters will be passed through to the functions above.
	parameters?: (
		availableParameters: Record<string, any>
	) => Parameters;
}

interface FeatureTransformFileOrWriteFileCommonOptions {
	// Tells if some parameters are passed "in bulk" as an array describing all sheets.
	// Examples of such parameters: sheet data, `schema`, `columns`.
	// Custom parameters used by the feature could also potentially follow such technique.
	multipleSheetsParameters: boolean;
	// "Sanitizes" an XML attribute value.
	// Use it when inserting an XML attribute value.
	attributeValue: (value: string) => string;
	// "Sanitizes" an XML element text content.
	// Use it when inserting an XML element text content.
	textContent: (text: string) => string;
}

interface FeatureTransformFileRelatedToSpecificSheetOptions extends FeatureTransformFileOrWriteFileCommonOptions {
	// `sheetIndex` could be used to get the parameters for this specific sheet
	// when those parameters are passed "in bulk" as an array describing all sheets.
	sheetIndex: number;
	// `sheetId` could be used in file names when creating new files.
	sheetId: string;
}

interface FeatureTransformFileOptions extends FeatureTransformFileOrWriteFileCommonOptions {}

interface FeatureTransformFile extends FeatureTransformFileInterface<FeatureTransformFileOptions> {}
interface FeatureTransformFileRelatedToSpecificSheet extends FeatureTransformFileInterface<FeatureTransformFileRelatedToSpecificSheetOptions> {}

type ReadWriteFileContent<FileContent> = FileContent | string;

interface FeatureWriteFilesOptions<FileContent> extends FeatureTransformFileOrWriteFileCommonOptions {
	// Reads a file from a certain path inside the `.xlsx` file.
	read(path: string): ReadWriteFileContent<FileContent> | undefined;
}

interface FeatureWriteFiles<FileContent, Parameters = Record<string, any>> {
	// Writes new files or overwrites existing ones.
	files?: (
		parameters: Parameters,
		options: FeatureWriteFilesOptions<FileContent>
	) => Record<string, ReadWriteFileContent<FileContent>> | undefined,

	// These parameters will be passed through to the functions above.
	parameters?: (
		availableParameters: Record<string, any>
	) => Parameters;
}

export interface Feature<FileContent> {
	files?: {
		transform?: {
			'[Content_Types].xml'?: FeatureTransformFile,
			'_rels/.rels'?: FeatureTransformFile,
			'xl/styles.xml'?: FeatureTransformFile,
			'xl/workbook.xml'?: FeatureTransformFile,
			'xl/_rels/workbook.xml.rels'?: FeatureTransformFile,
			'xl/worksheets/sheet{id}.xml'?: FeatureTransformFileRelatedToSpecificSheet,
			'xl/worksheets/_rels/sheet{id}.xml.rels'?: FeatureTransformFileRelatedToSpecificSheet,
			'xl/drawings/drawing{id}.xml'?: FeatureTransformFileRelatedToSpecificSheet,
			'xl/drawings/_rels/drawing{id}.xml.rels'?: FeatureTransformFileRelatedToSpecificSheet
		},
		write?: FeatureWriteFiles<FileContent>
	};
}

// Options.

interface CommonOptionsSingleSheet<FileContent> extends CommonOptions<FileContent>, ConditionalFormattingParametersSingleSheet, ImagesParametersSingleSheet<FileContent> {
	sheet?: string;
}

interface CommonOptionsMultipleSheets<FileContent> extends CommonOptions<FileContent>, ConditionalFormattingParametersMultipleSheets, ImagesParametersMultipleSheets<FileContent> {
	sheets?: string[];
}

// With Schema.

export interface OptionsSingleSheetWithSchema<Object, FileContent> extends CommonOptionsSingleSheet<FileContent>, AdditionalOptionsWhenUsingSchema<Object> {
	schema: Schema<Object>;
}

export interface OptionsMultipleSheetsWithSchema<Object, FileContent> extends CommonOptionsMultipleSheets<FileContent>, AdditionalOptionsWhenUsingSchema<Object> {
	schema: Schema<Object>[];
}

// Without Schema.

export interface OptionsSingleSheetWithoutSchema<FileContent> extends CommonOptionsSingleSheet<FileContent> {
	columns?: Columns;
}

export interface OptionsMultipleSheetsWithoutSchema<FileContent> extends CommonOptionsMultipleSheets<FileContent> {
	columns?: Columns[];
}
