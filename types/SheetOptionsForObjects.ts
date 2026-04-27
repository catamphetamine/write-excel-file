import { SheetOptions } from './SheetOptions.d.js'
import { Column } from './getSheetData.d.js'

export interface SheetOptionsForObjects<Object, FileContent> extends SheetOptions<FileContent> {
	columns: Column<Object>[];
}