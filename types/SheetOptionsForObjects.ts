import type { SheetOptions } from './SheetOptions.d.js'
import type { Column } from './getSheetData.d.js'

export interface SheetOptionsForObjects<Object, FileContent> extends SheetOptions<FileContent> {
	columns: Column<Object>[];
}