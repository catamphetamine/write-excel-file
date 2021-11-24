type ValueType =
	String |
	Date |
	Number |
	Boolean;

// It's unclear how to express something like `type? = Type` in TypeScript.
// So instead it's defined as `type?: CellType<Type>`.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/4#note_715204034
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
type CellType<Type> =
	Type extends String
		? StringConstructor
		: Type extends Date
			? DateConstructor
			: Type extends Number
				? NumberConstructor
				: Type extends Boolean
					? BooleanConstructor
					: never

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
	// It's unclear how to express something like `type? = Type` in TypeScript.
	type?: CellType<Type>;
	// A simpler (loose) variant:
	// type?: ValueType;
	format?: string;
}

interface CellOfType<Type> extends CellProps<Type> {
	value?: Type;
}

type Cell = CellOfType<ValueType>

export type Row = Cell[];

export type SheetData = Row[];

interface ColumnSchema<Object, Type> extends CellProps<Type> {
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

export type Columns = Column[];

export interface CommonOptions {
  headerStyle?: CellProps<ValueType>;
  fontFamily?: string;
  fontSize?: number;
  dateFormat?: string;
}

// With Schema.

interface WithSchemaOptions<Object> extends CommonOptions {
	sheets?: string[];
	schema: Schema<Object> | Schema<Object>[];
	fileName: string;
}

declare function writeXlsxFile<Object>(
	objects: Object[] | Object[][],
	options: WithSchemaOptions<Object>
) : Promise<void>;

// Without Schema.

interface WithoutSchemaOptions extends CommonOptions {
	sheets?: string[];
	columns?: Columns | Columns[];
	fileName: string;
}

declare function writeXlsxFile(
	data: SheetData | SheetData[],
	options: WithoutSchemaOptions
) : Promise<void>;

export default writeXlsxFile;