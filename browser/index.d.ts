// The contents of this file is identical between the different exports:
// `/node`, `/browser`, etc.

import type { ReturnType } from './ReturnType.d.js'
import type { FileContent } from './FileContent.d.js'

import type { ImageType } from '../types/features/images.d.js'

import type { Sheet } from '../types/Sheet.js'
import type { SheetOptions } from '../types/SheetOptions.js'
import type { SheetOptionsForObjects } from '../types/SheetOptionsForObjects.js'
import type { SheetData } from '../types/SheetData.js'
import type { Options } from '../types/Options.d.js'
import type { Column } from '../types/getSheetData.d.js'

export type { Sheet } from '../types/Sheet.js'
export type { SheetOptions } from '../types/SheetOptions.js'
export type { Value, Cell, CellObject, Row, SheetData } from '../types/SheetData.js'
export type { Options } from '../types/Options.d.js'
export type { Column } from '../types/getSheetData.d.js'
export type { Feature } from '../types/Feature.d.js'

export type Image = ImageType<FileContent>;

// Single sheet
declare function writeXlsxFile(
	sheetData: SheetData,
	sheetOptions?: SheetOptions<FileContent>,
	options?: Options<FileContent>
): ReturnType;

// Single sheet (objects)
declare function writeXlsxFile<Object>(
	objects: Object[],
	sheetOptions: SheetOptionsForObjects<Object, FileContent>,
	options?: Options<FileContent>
): ReturnType;

// Multiple sheets
declare function writeXlsxFile(
	sheets: Sheet<FileContent>[],
	options?: Options<FileContent>
): ReturnType;

export default writeXlsxFile;

export function getSheetData<Object>(objects: Object[], columns: Column<Object>[]): SheetData;