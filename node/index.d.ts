import {
	SheetData,
	Columns,
	Schema,
	CommonOptions
} from '../index.d';

export {
	Row
} from '../index.d';

export interface Stream {
	pipe(output: Stream): void;
}

// If `filePath` parameter is not passed then the returned `Promise`
// resolves to a `Stream`-like object having a `.pipe()` method.

// With Schema.

interface WithSchemaCommonOptions<Object> extends CommonOptions {
	schema: Schema<Object> | Schema<Object>[];
	filePath?: string;
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
) : Promise<void | Stream>;

// Without Schema.

interface WithoutSchemaCommonOptions extends CommonOptions {
	columns?: Columns | Columns[];
	filePath?: string;
}

interface WithoutSchemaOptions extends WithoutSchemaCommonOptions {
	sheet?: string;
}

interface WithoutSchemaOptionsMultipleSheets extends WithoutSchemaCommonOptions {
	sheets?: string[];
}

declare function writeXlsxFile(
	data: SheetData | SheetData[],
	options?: WithoutSchemaOptions | WithoutSchemaOptionsMultipleSheets
) : Promise<void | Stream>;

export default writeXlsxFile;