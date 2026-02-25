// `Readable` type becomes globally available after installing `@types/node`.
// https://stackoverflow.com/questions/49508610/type-for-nodejs-stream-stream-in-typescript
// Or does it?
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/53#note_1245377052

import Stream, { Readable } from 'stream'
import { Blob } from 'buffer'

import { ImageType } from '../types/features/images.d.js'

import {
	SheetData,
	OptionsSingleSheetWithSchema,
	OptionsMultipleSheetsWithSchema,
	OptionsSingleSheetWithoutSchema,
	OptionsMultipleSheetsWithoutSchema
} from '../types/api.d.js'

export { ValueType, Cell, CellObject, Row, SheetData, ColumnSchema, Schema, Feature } from '../types/api.d.js'

type FileContent = Stream | Buffer | Blob;

export type Image = ImageType<FileContent>;

interface AdditionalOptionsReturnStream {}

interface AdditionalOptionsReturnBuffer {
	buffer: true;
}

// interface AdditionalOptionsReturnBlob {
// 	blob: true;
// }

interface AdditionalOptionsWriteToFile {
	filePath: string;
}

// export interface Stream {
// 	pipe(output: Stream): void;
// }

// If `filePath` parameter is not passed then the returned `Promise`
// resolves to a `Stream`-like object having a `.pipe()` method.

// With Schema.

interface OptionsSingleSheetWithSchemaWriteToFile<Object> extends OptionsSingleSheetWithSchema<Object, FileContent>, AdditionalOptionsWriteToFile {}
interface OptionsMultipleSheetsWithSchemaWriteToFile<Object> extends OptionsMultipleSheetsWithSchema<Object, FileContent>, AdditionalOptionsWriteToFile {}

interface OptionsSingleSheetWithSchemaReturnBuffer<Object> extends OptionsSingleSheetWithSchema<Object, FileContent>, AdditionalOptionsReturnBuffer {}
interface OptionsMultipleSheetsWithSchemaReturnBuffer<Object> extends OptionsMultipleSheetsWithSchema<Object, FileContent>, AdditionalOptionsReturnBuffer {}

// interface OptionsSingleSheetWithSchemaReturnBlob<Object> extends OptionsSingleSheetWithSchema<Object, FileContent>, AdditionalOptionsReturnBlob {}
// interface OptionsMultipleSheetsWithSchemaReturnBlob<Object> extends OptionsMultipleSheetsWithSchema<Object, FileContent>, AdditionalOptionsReturnBlob {}

interface OptionsSingleSheetWithSchemaReturnStream<Object> extends OptionsSingleSheetWithSchema<Object, FileContent>, AdditionalOptionsReturnStream {}
interface OptionsMultipleSheetsWithSchemaReturnStream<Object> extends OptionsMultipleSheetsWithSchema<Object, FileContent>, AdditionalOptionsReturnStream {}

// With `schema`.
// Write to a file.
declare function writeXlsxFile<Object>(
	objects: Object[] | Object[][],
	options: OptionsSingleSheetWithSchemaWriteToFile<Object> | OptionsMultipleSheetsWithSchemaWriteToFile<Object>
) : Promise<void>;

// With `schema`.
// Return `Buffer`.
declare function writeXlsxFile<Object>(
	objects: Object[] | Object[][],
	options: OptionsSingleSheetWithSchemaReturnBuffer<Object> | OptionsMultipleSheetsWithSchemaReturnBuffer<Object>
) : Promise<Buffer>;

// With `schema`.
// Return `Stream`.
declare function writeXlsxFile<Object>(
	objects: Object[] | Object[][],
	options: OptionsSingleSheetWithSchemaReturnStream<Object> | OptionsMultipleSheetsWithSchemaReturnStream<Object>
) : Promise<Readable>;

// Without Schema.

interface OptionsSingleSheetWithoutSchemaWriteToFile extends OptionsSingleSheetWithoutSchema<FileContent>, AdditionalOptionsWriteToFile {}
interface OptionsMultipleSheetsWithoutSchemaWriteToFile extends OptionsMultipleSheetsWithoutSchema<FileContent>, AdditionalOptionsWriteToFile {}

interface OptionsSingleSheetWithoutSchemaReturnBuffer extends OptionsSingleSheetWithoutSchema<FileContent>, AdditionalOptionsReturnBuffer {}
interface OptionsMultipleSheetsWithoutSchemaReturnBuffer extends OptionsMultipleSheetsWithoutSchema<FileContent>, AdditionalOptionsReturnBuffer {}

// interface OptionsSingleSheetWithoutSchemaReturnBlob extends OptionsSingleSheetWithoutSchema<FileContent>, AdditionalOptionsReturnBlob {}
// interface OptionsMultipleSheetsWithoutSchemaReturnBlob extends OptionsMultipleSheetsWithoutSchema<FileContent>, AdditionalOptionsReturnBlob {}

interface OptionsSingleSheetWithoutSchemaReturnStream extends OptionsSingleSheetWithoutSchema<FileContent>, AdditionalOptionsReturnStream {}
interface OptionsMultipleSheetsWithoutSchemaReturnStream extends OptionsMultipleSheetsWithoutSchema<FileContent>, AdditionalOptionsReturnStream {}

// Write to a file.
declare function writeXlsxFile(
	data: SheetData,
	options: OptionsSingleSheetWithoutSchemaWriteToFile
) : Promise<void>;

// Write to a file.
// Multiple `sheets`.
declare function writeXlsxFile(
	data: SheetData[],
	options: OptionsMultipleSheetsWithoutSchemaWriteToFile
) : Promise<void>;

// Return `Buffer`.
declare function writeXlsxFile(
	data: SheetData,
	options: OptionsSingleSheetWithoutSchemaReturnBuffer
) : Promise<Buffer>;

// Return `Buffer`.
// Multiple `sheets`.
declare function writeXlsxFile(
	data: SheetData[],
	options: OptionsMultipleSheetsWithoutSchemaReturnBuffer
) : Promise<Buffer>;

// Return `Stream`.
declare function writeXlsxFile(
	data: SheetData,
	options?: OptionsSingleSheetWithoutSchemaReturnStream
) : Promise<Readable>;

// Return `Stream`.
// Multiple `sheets`.
declare function writeXlsxFile(
	data: SheetData[],
	options?: OptionsMultipleSheetsWithoutSchemaReturnStream
) : Promise<Readable>;

export default writeXlsxFile;