import {
	SheetData,
	Columns,
	Schema,
	CommonOptions
} from '../index.d';

export {
	Row
} from '../index.d';

interface Stream {
	pipe(output: Stream): void;
}

// If `filePath` parameter is not passed then the returned `Promise`
// resolves to a `Stream`-like object having a `.pipe()` method.

// With Schema.

interface WithSchemaOptions<Object> extends CommonOptions {
	sheets?: string[];
	schema: Schema<Object> | Schema<Object>[];
	filePath?: string;
}

declare function writeXlsxFile<Object>(
	objects: Object[] | Object[][],
	options: WithSchemaOptions<Object> | WithSchemaOptionsMultipleSheets<Object>
) : Promise<void | Stream>;

// Without Schema.

interface WithoutSchemaOptions extends CommonOptions {
	sheets?: string[];
	columns?: Columns | Columns[];
	filePath?: string;
}

declare function writeXlsxFile(
	data: SheetData | SheetData[],
	options?: WithoutSchemaOptions
) : Promise<void | Stream>;

export default writeXlsxFile;