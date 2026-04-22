import { Cell } from './SheetData.js'

// Some users have requested exporting `Column` type.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/30
export interface Column<Object> {
	// Column header cell.
	header?: Cell;
	// Column non-header cell.
	cell: (object: Object, objectIndex: number) => Cell;
}