// The contents of this file is identical between the different exports:
// `/node`, `/browser`, etc.

import { ReturnType } from './ReturnType.d.js'
import { FileContent } from './FileContent.d.js'

import { ImageType } from '../types/features/images.d.js'

import { Sheet } from '../types/Sheet.js'
import { SheetOptions } from '../types/SheetOptions.js'
import { SheetData } from '../types/SheetData.js'
import { Options } from '../types/Options.d.js'
import { Column } from '../types/getSheetData.d.js'

export { Sheet } from '../types/Sheet.js'
export { SheetOptions } from '../types/SheetOptions.js'
export { Value, Cell, CellObject, Row, SheetData } from '../types/SheetData.js'
export { Options } from '../types/Options.d.js'
export { Column } from '../types/getSheetData.d.js'
export { Feature } from '../types/Feature.d.js'

export type Image = ImageType<FileContent>;

// Single sheet
declare function writeXlsxFile(
	sheetData: SheetData,
	sheetOptions?: SheetOptions<FileContent>,
	options?: Options<FileContent>
): ReturnType;

// Multiple sheets
declare function writeXlsxFile(
	sheets: Sheet<FileContent>[],
	options?: Options<FileContent>
): ReturnType;

export default writeXlsxFile;

export function getSheetData<Object>(objects: Object[], columns: Column<Object>[]): SheetData;