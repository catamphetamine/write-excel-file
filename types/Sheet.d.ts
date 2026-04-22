import { SheetData } from './SheetData.d.js'
import { SheetOptions } from './SheetOptions.d.js'

export interface Sheet<FileContent> extends SheetOptions<FileContent> {
	data: SheetData<FileContent>;
}