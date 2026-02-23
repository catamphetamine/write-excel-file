import { ImageType } from '../types/features/images.d.js'

import {
	SheetData,
	OptionsSingleSheetWithSchema,
	OptionsMultipleSheetsWithSchema,
	OptionsSingleSheetWithoutSchema,
	OptionsMultipleSheetsWithoutSchema
} from '../types/api.d.js'

export { ValueType, Cell, CellObject, Row, SheetData, ColumnSchema, Schema, Feature } from '../types/api.d.js'

type FileContent = File | Blob | ArrayBuffer;

export type Image = ImageType<FileContent>;

interface AdditionalOptionsReturnBlob {}

interface AdditionalOptionsDownloadFile {
	fileName: string;
}

// With Schema.

interface OptionsSingleSheetWithSchemaReturnBlob<Object> extends OptionsSingleSheetWithSchema<Object, FileContent>, AdditionalOptionsReturnBlob {}
interface OptionsMultipleSheetsWithSchemaReturnBlob<Object> extends OptionsMultipleSheetsWithSchema<Object, FileContent>, AdditionalOptionsReturnBlob {}

interface OptionsSingleSheetWithSchemaDownloadFile<Object> extends OptionsSingleSheetWithSchema<Object, FileContent>, AdditionalOptionsDownloadFile {}
interface OptionsMultipleSheetsWithSchemaDownloadFile<Object> extends OptionsMultipleSheetsWithSchema<Object, FileContent>, AdditionalOptionsDownloadFile {}

// With `schema`.
// Download file.
declare function writeXlsxFile<Object>(
	objects: Object[],
	options: OptionsSingleSheetWithSchemaDownloadFile<Object>
) : Promise<void>;

// With `schema`.
// Return `Blob`.
declare function writeXlsxFile<Object>(
	objects: Object[],
	options: OptionsSingleSheetWithSchemaReturnBlob<Object>
) : Promise<Blob>;

// With `schema`.
// Download file.
// Multiple `sheets`.
declare function writeXlsxFile<Object>(
	objects: Object[][],
	options: OptionsMultipleSheetsWithSchemaDownloadFile<Object>
) : Promise<void>;

// With `schema`.
// Return `Blob`.
// Multiple `sheets`.
declare function writeXlsxFile<Object>(
	objects: Object[][],
	options: OptionsMultipleSheetsWithSchemaReturnBlob<Object>
) : Promise<Blob>;

// Without Schema.

interface OptionsSingleSheetWithoutSchemaReturnBlob extends OptionsSingleSheetWithoutSchema<FileContent>, AdditionalOptionsReturnBlob {}
interface OptionsMultipleSheetsWithoutSchemaReturnBlob extends OptionsMultipleSheetsWithoutSchema<FileContent>, AdditionalOptionsReturnBlob {}

interface OptionsSingleSheetWithoutSchemaDownloadFile extends OptionsSingleSheetWithoutSchema<FileContent>, AdditionalOptionsDownloadFile {}
interface OptionsMultipleSheetsWithoutSchemaDownloadFile extends OptionsMultipleSheetsWithoutSchema<FileContent>, AdditionalOptionsDownloadFile {}

// Return `Blob`.
declare function writeXlsxFile(
	data: SheetData,
	options: OptionsSingleSheetWithoutSchemaReturnBlob
) : Promise<Blob>;

// Return `Blob`.
// Multiple `sheets`.
declare function writeXlsxFile(
	data: SheetData[],
	options: OptionsMultipleSheetsWithoutSchemaReturnBlob
) : Promise<Blob>;

// Download file.
declare function writeXlsxFile(
	data: SheetData,
	options: OptionsSingleSheetWithoutSchemaDownloadFile
) : Promise<void>;

// Download file.
// Multiple `sheets`.
declare function writeXlsxFile(
	data: SheetData[],
	options: OptionsMultipleSheetsWithoutSchemaDownloadFile
) : Promise<void>;

export default writeXlsxFile;