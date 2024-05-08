import {
	Schema,
	SheetData_,
	Row_,
	Cell_,
	Columns,
	CommonOptions
} from '../index.d.js';

export {
	Schema
} from '../index.d.js';

// `Readable` type becomes globally available after installing `@types/node`.
// https://stackoverflow.com/questions/49508610/type-for-nodejs-stream-stream-in-typescript
// Or does it?
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/53#note_1245377052

import { Readable } from 'stream';
import { PathLike } from 'fs';

type ImageData = Readable | Buffer | PathLike;

type SheetData = SheetData_<ImageData>;

export type Row = Row_<ImageData>;
export type Cell = Cell_<ImageData>;

// export interface Stream {
// 	pipe(output: Stream): void;
// }

// If `filePath` parameter is not passed then the returned `Promise`
// resolves to a `Stream`-like object having a `.pipe()` method.

// With Schema.

interface WithSchemaCommonOptionsWriteToFile<Object> extends CommonOptions {
	schema: Schema<Object> | Schema<Object>[];
	filePath: string;
}

interface WithSchemaCommonOptionsReturnBuffer<Object> extends CommonOptions {
	schema: Schema<Object> | Schema<Object>[];
	buffer: true;
}

interface WithSchemaCommonOptionsReturnStream<Object> extends CommonOptions {
	schema: Schema<Object> | Schema<Object>[];
}

interface WithSchemaOptionsWriteToFile<Object> extends WithSchemaCommonOptionsWriteToFile<Object> {
	sheet?: string;
}

interface WithSchemaOptionsMultipleSheetsWriteToFile<Object> extends WithSchemaCommonOptionsWriteToFile<Object> {
	sheets?: string[];
}

interface WithSchemaOptionsReturnBuffer<Object> extends WithSchemaCommonOptionsReturnBuffer<Object> {
	sheet?: string;
}

interface WithSchemaOptionsMultipleSheetsReturnBuffer<Object> extends WithSchemaCommonOptionsReturnBuffer<Object> {
	sheets?: string[];
}

interface WithSchemaOptionsReturnStream<Object> extends WithSchemaCommonOptionsReturnStream<Object> {
	sheet?: string;
}

interface WithSchemaOptionsMultipleSheetsReturnStream<Object> extends WithSchemaCommonOptionsReturnStream<Object> {
	sheets?: string[];
}

declare function writeXlsxFile<Object>(
	objects: Object[] | Object[][],
	options: WithSchemaOptionsWriteToFile<Object> | WithSchemaOptionsMultipleSheetsWriteToFile<Object>
) : Promise<void>;

declare function writeXlsxFile<Object>(
	objects: Object[] | Object[][],
	options: WithSchemaOptionsReturnBuffer<Object> | WithSchemaOptionsMultipleSheetsReturnBuffer<Object>
) : Promise<Buffer>;

declare function writeXlsxFile<Object>(
	objects: Object[] | Object[][],
	options: WithSchemaOptionsReturnStream<Object> | WithSchemaOptionsMultipleSheetsReturnStream<Object>
) : Promise<Readable>;

// Without Schema.

interface WithoutSchemaCommonOptionsWriteToFile extends CommonOptions {
	columns?: Columns | Columns[];
	filePath: string;
}

interface WithoutSchemaCommonOptionsReturnBuffer extends CommonOptions {
	columns?: Columns | Columns[];
	buffer: true;
}

interface WithoutSchemaCommonOptionsReturnStream extends CommonOptions {
	columns?: Columns | Columns[];
}

interface WithoutSchemaOptionsWriteToFile extends WithoutSchemaCommonOptionsWriteToFile {
	sheet?: string;
}

interface WithoutSchemaOptionsMultipleSheetsWriteToFile extends WithoutSchemaCommonOptionsWriteToFile {
	sheets?: string[];
}

interface WithoutSchemaOptionsReturnBuffer extends WithoutSchemaCommonOptionsReturnBuffer {
	sheet?: string;
}

interface WithoutSchemaOptionsMultipleSheetsReturnBuffer extends WithoutSchemaCommonOptionsReturnBuffer {
	sheets?: string[];
}

interface WithoutSchemaOptionsReturnStream extends WithoutSchemaCommonOptionsReturnStream {
	sheet?: string;
}

interface WithoutSchemaOptionsMultipleSheetsReturnStream extends WithoutSchemaCommonOptionsReturnStream {
	sheets?: string[];
}

declare function writeXlsxFile(
	data: SheetData | SheetData[],
	options: WithoutSchemaOptionsWriteToFile | WithoutSchemaOptionsMultipleSheetsWriteToFile
) : Promise<void>;

declare function writeXlsxFile(
	data: SheetData | SheetData[],
	options: WithoutSchemaOptionsReturnBuffer | WithoutSchemaOptionsMultipleSheetsReturnBuffer
) : Promise<Buffer>;

declare function writeXlsxFile(
	data: SheetData | SheetData[],
	options?: WithoutSchemaOptionsReturnStream | WithoutSchemaOptionsMultipleSheetsReturnStream
) : Promise<Readable>;

export default writeXlsxFile;