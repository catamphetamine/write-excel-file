type ImageData = File | Blob | ArrayBuffer;

interface ImageValueType<ImageDataType> {
	data: ImageDataType;
	width: number;
	height: number;
	name?: string;
	description?: string;
}

// Images haven't been implemented, so TypeScript for them is disabled.
// https://gitlab.com/catamphetamine/write-excel-file/-/blob/main/docs/IMAGES.md
//
// type ValueType_<ImageDataType> =
// 	String |
// 	Date |
// 	Number |
// 	Boolean |
// 	ImageValueType<ImageDataType>;

type ValueType_<ImageDataType> =
	String |
	Date |
	Number |
	Boolean;

// Some users have requested exporting `ValueType` type.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/30
export type ValueType = ValueType_<ImageData>;

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

// Images haven't been implemented, so TypeScript for them is disabled.
// https://gitlab.com/catamphetamine/write-excel-file/-/blob/main/docs/IMAGES.md
// type TypeOfType<Type> = TypeConstructor<Type> | 'Formula' | 'Image';
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

	// Data output format (for numbers or dates).
	format?: string;
}

interface CellOfType<Type> extends CellProps<Type> {
	value?: Type;
}

export type Cell_<ImageDataType> = CellOfType<ValueType_<ImageDataType>> | null | undefined;
export type Cell = Cell_<ImageData>;

export type Row_<ImageDataType> = Cell_<ImageDataType>[];
export type Row = Row_<ImageData>;

export type SheetData_<ImageDataType> = Row_<ImageDataType>[];
export type SheetData = SheetData_<ImageData>;

// Some users have requested exporting `ColumnSchema` type.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/30
export interface ColumnSchema<Object, Type> extends CellProps<Type> {
	// Column title.
	column?: string;
	// Column width (in characters).
	width?: number;
	// Cell value getter.
	value(object: Object): Type | undefined | null;
}

export type Schema<Object> = ColumnSchema<Object, ValueType>[];

type Column = {
	width?: number;
};

type Orientation = 'landscape';

export type Columns = Column[];

export interface CommonOptions {
  headerStyle?: CellStyle;
  fontFamily?: string;
  fontSize?: number;
  orientation?: Orientation;
  stickyColumnsCount?: number;
  stickyRowsCount?: number;
  dateFormat?: string;
}

// With Schema.

interface WithSchemaCommonOptions<Object> extends CommonOptions {
	schema: Schema<Object> | Schema<Object>[];
	fileName?: string;
}

interface WithSchemaOptions<Object> extends WithSchemaCommonOptions<Object> {
	sheet?: string;
}

interface WithSchemaOptionsMultipleSheets<Object> extends WithSchemaCommonOptions<Object> {
	sheets?: string[];
}

declare function writeXlsxFile<Object>(
	objects: Object[] | Object[][],
	options: WithSchemaOptions<Object> | WithSchemaOptionsMultipleSheets<Object>
) : Promise<void>;

// Without Schema.

interface WithoutSchemaWithoutFileNameCommonOptions extends CommonOptions {
	columns?: Columns | Columns[];
}

interface WithoutSchemaWithFileNameCommonOptions extends CommonOptions {
	columns?: Columns | Columns[];
	fileName: string;
}

interface WithoutSchemaWithoutFileNameOptions extends WithoutSchemaWithoutFileNameCommonOptions {
	sheet?: string;
}

interface WithoutSchemaWithFileNameOptions extends WithoutSchemaWithFileNameCommonOptions {
	sheet?: string;
}

interface WithoutSchemaWithoutFileNameOptionsMultipleSheets extends WithoutSchemaWithoutFileNameCommonOptions {
	sheets?: string[];
}

interface WithoutSchemaWithFileNameOptionsMultipleSheets extends WithoutSchemaWithFileNameCommonOptions {
	sheets?: string[];
}

declare function writeXlsxFile(
	data: SheetData | SheetData[],
	options: WithoutSchemaWithoutFileNameOptions | WithoutSchemaWithoutFileNameOptionsMultipleSheets
) : Promise<Blob>;

declare function writeXlsxFile(
	data: SheetData | SheetData[],
	options: WithoutSchemaWithFileNameOptions | WithoutSchemaWithFileNameOptionsMultipleSheets
) : Promise<void>;

export default writeXlsxFile;