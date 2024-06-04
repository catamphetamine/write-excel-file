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
	filePath: string;
}

interface WithSchemaCommonOptionsReturnBuffer<Object> extends CommonOptions {
	buffer: true;
}

interface WithSchemaCommonOptionsReturnStream<Object> extends CommonOptions {
}

interface WithSchemaOptionsWriteToFile<Object> extends WithSchemaCommonOptionsWriteToFile<Object> {
	schema: Schema<Object>;
	sheet?: string;
}

interface WithSchemaOptionsMultipleSheetsWriteToFile<Object> extends WithSchemaCommonOptionsWriteToFile<Object> {
	schema: Schema<Object>[];
	sheets?: string[];
}

interface WithSchemaOptionsReturnBuffer<Object> extends WithSchemaCommonOptionsReturnBuffer<Object> {
	schema: Schema<Object>;
	sheet?: string;
}

interface WithSchemaOptionsMultipleSheetsReturnBuffer<Object> extends WithSchemaCommonOptionsReturnBuffer<Object> {
	schema: Schema<Object>[];
	sheets?: string[];
}

interface WithSchemaOptionsReturnStream<Object> extends WithSchemaCommonOptionsReturnStream<Object> {
	schema: Schema<Object>;
	sheet?: string;
}

interface WithSchemaOptionsMultipleSheetsReturnStream<Object> extends WithSchemaCommonOptionsReturnStream<Object> {
	schema: Schema<Object>[];
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
	filePath: string;
}

interface WithoutSchemaCommonOptionsReturnBuffer extends CommonOptions {
	buffer: true;
}

interface WithoutSchemaCommonOptionsReturnStream extends CommonOptions {
}

interface WithoutSchemaOptionsWriteToFile extends WithoutSchemaCommonOptionsWriteToFile {
	columns?: Columns;
	sheet?: string;
}

interface WithoutSchemaOptionsMultipleSheetsWriteToFile extends WithoutSchemaCommonOptionsWriteToFile {
	columns?: Columns[];
	sheets?: string[];
}

interface WithoutSchemaOptionsReturnBuffer extends WithoutSchemaCommonOptionsReturnBuffer {
	columns?: Columns;
	sheet?: string;
}

interface WithoutSchemaOptionsMultipleSheetsReturnBuffer extends WithoutSchemaCommonOptionsReturnBuffer {
	columns?: Columns[];
	sheets?: string[];
}

interface WithoutSchemaOptionsReturnStream extends WithoutSchemaCommonOptionsReturnStream {
	columns?: Columns;
	sheet?: string;
}

interface WithoutSchemaOptionsMultipleSheetsReturnStream extends WithoutSchemaCommonOptionsReturnStream {
	columns?: Columns[];
	sheets?: string[];
}

declare function writeXlsxFile(
	data: SheetData,
	options: WithoutSchemaOptionsWriteToFile
) : Promise<void>;

declare function writeXlsxFile(
	data: SheetData[],
	options: WithoutSchemaOptionsMultipleSheetsWriteToFile
) : Promise<void>;

declare function writeXlsxFile(
	data: SheetData,
	options: WithoutSchemaOptionsReturnBuffer
) : Promise<Buffer>;

declare function writeXlsxFile(
	data: SheetData[],
	options: WithoutSchemaOptionsMultipleSheetsReturnBuffer
) : Promise<Buffer>;

declare function writeXlsxFile(
	data: SheetData,
	options?: WithoutSchemaOptionsReturnStream
) : Promise<Readable>;

declare function writeXlsxFile(
	data: SheetData[],
	options?: WithoutSchemaOptionsMultipleSheetsReturnStream
) : Promise<Readable>;

export default writeXlsxFile;