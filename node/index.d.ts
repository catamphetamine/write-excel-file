// `Readable` type becomes globally available after installing `@types/node`.
// https://stackoverflow.com/questions/49508610/type-for-nodejs-stream-stream-in-typescript
// Or does it?
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/53#note_1245377052

import Stream, { Readable } from 'stream'
import { PathLike } from 'fs';

import {
	Schema,
	SheetData,
	Row,
	Cell,
	Columns,
	CommonOptions,
	ImageType
} from '../index.d.js';

export {
	Schema
} from '../index.d.js';

type ImageContent = Stream | Buffer | PathLike;

export type Image = ImageType<ImageContent>;

// export interface Stream {
// 	pipe(output: Stream): void;
// }

// If `filePath` parameter is not passed then the returned `Promise`
// resolves to a `Stream`-like object having a `.pipe()` method.

// With Schema.

interface WithSchemaCommonOptionsWriteToFile<Object> extends CommonOptions<Object> {
	filePath: string;
}

interface WithSchemaCommonOptionsReturnBuffer<Object> extends CommonOptions<Object> {
	buffer: true;
}

interface WithSchemaCommonOptionsReturnStream<Object> extends CommonOptions<Object> {
}

interface OptionsSchemaImagesSheet {
	schema: Schema<Object>;
  images?: Image[];
	sheet?: string;
}

interface OptionsSchemaImagesSheets {
	schema: Schema<Object>[];
  images?: Image[][];
	sheets?: string[];
}

interface WithSchemaOptionsWriteToFile<Object> extends WithSchemaCommonOptionsWriteToFile<Object>, OptionsSchemaImagesSheet {
}

interface WithSchemaOptionsMultipleSheetsWriteToFile<Object> extends WithSchemaCommonOptionsWriteToFile<Object>, OptionsSchemaImagesSheets {
}

interface WithSchemaOptionsReturnBuffer<Object> extends WithSchemaCommonOptionsReturnBuffer<Object>, OptionsSchemaImagesSheet {
}

interface WithSchemaOptionsMultipleSheetsReturnBuffer<Object> extends WithSchemaCommonOptionsReturnBuffer<Object>, OptionsSchemaImagesSheets {
}

interface WithSchemaOptionsReturnStream<Object> extends WithSchemaCommonOptionsReturnStream<Object>, OptionsSchemaImagesSheet {
}

interface WithSchemaOptionsMultipleSheetsReturnStream<Object> extends WithSchemaCommonOptionsReturnStream<Object>, OptionsSchemaImagesSheets {
}

// With `schema`.
// Write to a file.
declare function writeXlsxFile<Object>(
	objects: Object[] | Object[][],
	options: WithSchemaOptionsWriteToFile<Object> | WithSchemaOptionsMultipleSheetsWriteToFile<Object>
) : Promise<void>;

// With `schema`.
// Return `Buffer`.
declare function writeXlsxFile<Object>(
	objects: Object[] | Object[][],
	options: WithSchemaOptionsReturnBuffer<Object> | WithSchemaOptionsMultipleSheetsReturnBuffer<Object>
) : Promise<Buffer>;

// With `schema`.
// Return `Stream`.
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

interface OptionsColumnsImagesSheet {
	columns?: Columns;
  images?: Image[];
	sheet?: string;
}

interface OptionsColumnsImagesSheets {
	columns?: Columns[];
  images?: Image[][];
	sheets?: string[];
}

interface WithoutSchemaOptionsWriteToFile extends WithoutSchemaCommonOptionsWriteToFile, OptionsColumnsImagesSheet {
}

interface WithoutSchemaOptionsMultipleSheetsWriteToFile extends WithoutSchemaCommonOptionsWriteToFile, OptionsColumnsImagesSheets {
}

interface WithoutSchemaOptionsReturnBuffer extends WithoutSchemaCommonOptionsReturnBuffer, OptionsColumnsImagesSheet {
}

interface WithoutSchemaOptionsMultipleSheetsReturnBuffer extends WithoutSchemaCommonOptionsReturnBuffer, OptionsColumnsImagesSheets {
}

interface WithoutSchemaOptionsReturnStream extends WithoutSchemaCommonOptionsReturnStream, OptionsColumnsImagesSheet {
}

interface WithoutSchemaOptionsMultipleSheetsReturnStream extends WithoutSchemaCommonOptionsReturnStream, OptionsColumnsImagesSheets {
}

// Write to a file.
declare function writeXlsxFile(
	data: SheetData,
	options: WithoutSchemaOptionsWriteToFile
) : Promise<void>;

// Write to a file.
// Multiple `sheets`.
declare function writeXlsxFile(
	data: SheetData[],
	options: WithoutSchemaOptionsMultipleSheetsWriteToFile
) : Promise<void>;

// Return `Buffer`.
declare function writeXlsxFile(
	data: SheetData,
	options: WithoutSchemaOptionsReturnBuffer
) : Promise<Buffer>;

// Return `Buffer`.
// Multiple `sheets`.
declare function writeXlsxFile(
	data: SheetData[],
	options: WithoutSchemaOptionsMultipleSheetsReturnBuffer
) : Promise<Buffer>;

// Return `Stream`.
declare function writeXlsxFile(
	data: SheetData,
	options?: WithoutSchemaOptionsReturnStream
) : Promise<Readable>;

// Return `Stream`.
// Multiple `sheets`.
declare function writeXlsxFile(
	data: SheetData[],
	options?: WithoutSchemaOptionsMultipleSheetsReturnStream
) : Promise<Readable>;

export default writeXlsxFile;