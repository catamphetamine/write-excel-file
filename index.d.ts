type ValueType =
	String |
	Date |
	Number |
	Boolean;

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

type Color = string;

interface CellStyle {
	align?: 'left' | 'center' | 'right';
	alignVertical?: 'top' | 'center' | 'bottom';
	height?: number;
	span?: number;
	rowSpan?: number;
	wrap?: boolean;
	fontWeight?: FontWeight;
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
	type?: Type;
	format?: string;
}

interface CellOfType<Type> extends CellProps<Type> {
	value?: typeof Type;
}

type Cell = CellOfType<ValueType>

type Row = Cell[];

export type SheetData = Row[];

interface ColumnSchema<Object, Type> extends CellProps<Type> {
	// Column title.
	column?: string;
	// Column width (in characters).
	width?: number;
	// Cell value getter.
	value(object: Object): typeof Type | undefined | null;
}

export type Schema<Object> = ColumnSchema<Object, ValueType>[];

type Column = {
	width?: number;
};

export type Columns = Column[];

export interface CommonOptions {
  headerStyle?: CellProps;
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

function writeXlsxFile<Object>(
	objects: Object[] | Object[][],
	options: WithSchemaOptions<Object>
) : Promise<void>;

// Without Schema.

interface WithoutSchemaOptions extends CommonOptions {
	sheets?: string[];
	columns?: Columns | Columns[];
	fileName: string;
}

function writeXlsxFile(
	data: SheetData | SheetData[],
	options: WithoutSchemaOptions
) : Promise<void>;

export default writeXlsxFile;