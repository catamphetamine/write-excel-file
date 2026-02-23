import { ImageType } from '../types/features/images.d.js'

import {
	SheetData,
	OptionsSingleSheetWithSchema,
	OptionsMultipleSheetsWithSchema,
	OptionsSingleSheetWithoutSchema,
	OptionsMultipleSheetsWithoutSchema
} from '../types/api.d.js'

export { ValueType, Cell, CellObject, Row, SheetData, ColumnSchema, Schema, Feature } from '../types/api.d.js'

type FileContent = Blob;

export type Image = ImageType<FileContent>;

// With Schema.

interface OptionsSingleSheetWithSchemaReturnBlob<Object> extends OptionsSingleSheetWithSchema<Object, FileContent> {}
interface OptionsMultipleSheetsWithSchemaReturnBlob<Object> extends OptionsMultipleSheetsWithSchema<Object, FileContent> {}

// With `schema`.
// Return `Blob`.
declare function writeXlsxFile<Object>(
	objects: Object[],
	options: OptionsSingleSheetWithSchemaReturnBlob<Object>
) : Promise<Blob>;

// With `schema`.
// Return `Blob`.
// Multiple `sheets`.
declare function writeXlsxFile<Object>(
	objects: Object[][],
	options: OptionsMultipleSheetsWithSchemaReturnBlob<Object>
) : Promise<Blob>;

// Without Schema.

interface OptionsSingleSheetWithoutSchemaReturnBlob extends OptionsSingleSheetWithoutSchema<FileContent> {}
interface OptionsMultipleSheetsWithoutSchemaReturnBlob extends OptionsMultipleSheetsWithoutSchema<FileContent> {}

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

export default writeXlsxFile;