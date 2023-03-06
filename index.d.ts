// Some users have requested exporting `ValueType` type.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/30
export type ValueType =
	String |
	Date |
	Number |
	Boolean |
	'Formula';

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
					: never

type TypeOfType<Type> = TypeConstructor<Type> | 'Formula'

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

interface WithoutSchemaCommonOptions extends CommonOptions {
	columns?: Columns | Columns[];
	fileName?: string;
}

interface WithoutSchemaOptions extends WithoutSchemaCommonOptions {
	sheet?: string;
}

interface WithoutSchemaOptionsMultipleSheets extends WithoutSchemaCommonOptions {
	sheets?: string[];
}

declare function writeXlsxFile(
	data: SheetData | SheetData[],
	options: WithoutSchemaOptions | WithoutSchemaOptionsMultipleSheets
) : Promise<void>;

export default writeXlsxFile;