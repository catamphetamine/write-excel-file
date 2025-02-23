// Some users have requested exporting `ValueType` type.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/30
export type ValueType =
	String |
	Date |
	Number |
	Boolean;

// It's unclear how to express something like `type? = Type` in TypeScript.
// So instead it's defined as `type?: TypeConstructor<Type>`.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/4#note_715204034
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
type TypeConstructor<Type> =
	Type extends String
		? StringConstructor
		: Type extends Date
			? DateConstructor
			: Type extends Number
				? NumberConstructor
				: Type extends Boolean
					? BooleanConstructor
					: never;

type TypeOfType<Type> = TypeConstructor<Type> | 'Formula';

type BorderStyle =
	'hair' |
	'dotted' |
	'dashDotDot' |
	'dashDot' |
	'dashed' |
	'thin' |
	'mediumDashDotDot' |
	'slantDashDot' |
	'mediumDashDot' |
	'mediumDashed' |
	'medium' |
	'double' |
	'thick';

type FontWeight = 'bold';

type FontStyle = 'italic';

type Color = string;

interface CellStyle {
	align?: 'left' | 'center' | 'right';
	alignVertical?: 'top' | 'center' | 'bottom';
	height?: number;
	span?: number;
	rowSpan?: number;
	indent?: number;
	wrap?: boolean;
	textRotation?: number;
	fontFamily?: string;
	fontSize?: number;
	fontWeight?: FontWeight;
	fontStyle?: FontStyle;
	color?: Color;
	backgroundColor?: Color;
	borderColor?: Color;
	borderStyle?: BorderStyle;
	leftBorderColor?: Color;
  leftBorderStyle?: BorderStyle;
  rightBorderColor?: Color;
  rightBorderStyle?: BorderStyle;
  topBorderColor?: Color;
  topBorderStyle?: BorderStyle;
  bottomBorderColor?: Color;
  bottomBorderStyle?: BorderStyle;
}

interface CellProps<Type> extends CellStyle {
	// TypeScript interprets `type?: Type` as "`type` is an instance of `Type`",
	// while in reality the definition of `type` is "`type` is `Type.constructor`".
	type?: TypeOfType<Type>;

	// A simpler (loose) variant:
	// type?: ValueType;

	// Data output format (for numbers or dates or strings).
	format?: string;
}

interface CellOfType<Type> extends CellProps<Type> {
	value?: Type;
}

export type Cell = CellOfType<ValueType> | null | undefined;
export type Row = Cell[];
export type SheetData = Row[];

// Some users have requested exporting `ColumnSchema` type.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/30
export interface ColumnSchema<Object, Type> extends CellProps<Type> {
	// Column title.
	column?: string;
	// Column width (in characters).
	width?: number;
	// Cell value getter.
	value(object: Object): Type | undefined | null;
	// Cell style getter.
	getCellStyle?(object: Object): CellStyle | undefined;
}

export type Schema<Object> = ColumnSchema<Object, ValueType>[];

type Column = {
	width?: number;
};

type Orientation = 'landscape';

export interface ImageType<ImageContent> {
	content: ImageContent;
	contentType: string;
	width: number;
	height: number;
	dpi: number;
	anchor: {
		row: number;
		column: number;
	};
	offsetX?: number;
	offsetY?: number;
	title?: string;
	description?: string;
}

type ImageContent = File | Blob | ArrayBuffer;

export type Image = ImageType<ImageContent>;

export type Columns = Column[];

export interface CommonOptions<Object = never> {
  // `headerStyle` parameter is deprecated, use `getHeaderStyle(columnSchema)` instead.
  headerStyle?: CellStyle;
  getHeaderStyle?: (columnSchema: ColumnSchema<Object, ValueType>) => CellStyle | undefined;
  fontFamily?: string;
  fontSize?: number;
  orientation?: Orientation;
  stickyColumnsCount?: number;
  stickyRowsCount?: number;
  showGridLines?: boolean;
  rightToLeft?: boolean;
  dateFormat?: string;
}

interface CommonOptionsWithoutFileName<Object = never> extends CommonOptions<Object> {}

interface CommonOptionsWriteToFile<Object = never> extends CommonOptions<Object> {
	fileName: string;
}

// With Schema.

export interface OptionsSchemaImagesSheet<Image> {
	schema: Schema<Object>;
  images?: Image[];
	sheet?: string;
}

export interface OptionsSchemaImagesSheets<Image> {
	schema: Schema<Object>[];
  images?: Image[][];
	sheets?: string[];
}

interface WithSchemaWithoutFileNameOptions<Object> extends CommonOptionsWithoutFileName<Object>, OptionsSchemaImagesSheet<Image> {
}

interface WithSchemaWriteToFileOptions<Object> extends CommonOptionsWriteToFile<Object>, OptionsSchemaImagesSheet<Image> {
}

interface WithSchemaWithoutFileNameOptionsMultipleSheets<Object> extends CommonOptionsWithoutFileName<Object>, OptionsSchemaImagesSheets<Image> {
}

interface WithSchemaWriteToFileOptionsMultipleSheets<Object> extends CommonOptionsWriteToFile<Object>, OptionsSchemaImagesSheets<Image> {
}

// With `schema`.
// Write to a file.
declare function writeXlsxFile<Object>(
	objects: Object[],
	options: WithSchemaWriteToFileOptions<Object>
) : Promise<void>;

// With `schema`.
// Return `Blob`.
declare function writeXlsxFile<Object>(
	objects: Object[],
	options: WithSchemaWithoutFileNameOptions<Object>
) : Promise<Blob>;

// With `schema`.
// Write to a file.
// Multiple `sheets`.
declare function writeXlsxFile<Object>(
	objects: Object[][],
	options: WithSchemaWriteToFileOptionsMultipleSheets<Object>
) : Promise<void>;

// With `schema`.
// Return `Blob`.
// Multiple `sheets`.
declare function writeXlsxFile<Object>(
	objects: Object[][],
	options: WithSchemaWithoutFileNameOptionsMultipleSheets<Object>
) : Promise<Blob>;

// Without Schema.

export interface OptionsColumnsImagesSheet<Image> {
	columns?: Columns;
  images?: Image[];
	sheet?: string;
}

export interface OptionsColumnsImagesSheets<Image> {
	columns?: Columns[];
  images?: Image[][];
	sheets?: string[];
}

interface WithoutSchemaWithoutFileNameOptions extends CommonOptionsWithoutFileName, OptionsColumnsImagesSheet<Image> {
}

interface WithoutSchemaWriteToFileOptions extends CommonOptionsWriteToFile, OptionsColumnsImagesSheet<Image> {
}

interface WithoutSchemaWithoutFileNameOptionsMultipleSheets extends CommonOptionsWithoutFileName, OptionsColumnsImagesSheets<Image> {
}

interface WithoutSchemaWriteToFileOptionsMultipleSheets extends CommonOptionsWriteToFile, OptionsColumnsImagesSheets<Image> {
}

// Return `Blob`.
declare function writeXlsxFile(
	data: SheetData,
	options: WithoutSchemaWithoutFileNameOptions
) : Promise<Blob>;

// Return `Blob`.
// Multiple `sheets`.
declare function writeXlsxFile(
	data: SheetData[],
	options: WithoutSchemaWithoutFileNameOptionsMultipleSheets
) : Promise<Blob>;

// Wrtie to a file.
declare function writeXlsxFile(
	data: SheetData,
	options: WithoutSchemaWriteToFileOptions
) : Promise<void>;

// Wrtie to a file.
// Multiple `sheets`.
declare function writeXlsxFile(
	data: SheetData[],
	options: WithoutSchemaWriteToFileOptionsMultipleSheets
) : Promise<void>;

export default writeXlsxFile;