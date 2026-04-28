import type { SheetData } from './SheetData.d.js'
import type { SheetOptions } from './SheetOptions.d.js'

export interface Sheet<FileContent> extends SheetOptions<FileContent> {
	data: SheetData;
}