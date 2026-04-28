import type { CellStyleProperties } from './CellStyleProperties.d.js'

// Some users have requested exporting `Value` type.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/30
export type Value =
	String |
	Date |
	Number |
	Boolean;

// A way to define a `type = String` or `type = Number` variable in TypeScript
// is by defining it as `type: StringConstructor` or `type: NumberConstructor`.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/4#note_715204034
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
type Constructor<ValueType> =
	ValueType extends String
		? StringConstructor
		: ValueType extends Date
			? DateConstructor
			: ValueType extends Number
				? NumberConstructor
				: ValueType extends Boolean
					? BooleanConstructor
					: never;

export type CellType<Value> = Constructor<Value> | 'Formula';

export interface CellProperties extends CellStyleProperties {
	// Data output format (for numbers or dates or strings).
	format?: string;
}

interface CellObjectOfType<Value> extends CellProperties {
	// Cell value.
	value?: Value;
	// Cell value type.
	type?: CellType<Value>;
}

export interface CellObject extends CellObjectOfType<Value> {}

export type Cell = CellObject | Value | null | undefined;
export type Row = Cell[];
export type SheetData = Row[];