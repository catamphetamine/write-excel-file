import { Cell } from './SheetData.d.js'
import { SheetOptionsColumn } from './SheetOptions.d.js';

// Some users have requested exporting `Column` type.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/30
export interface Column<Object> extends SheetOptionsColumn {
	// Column header cell.
	header?: Cell;
	// Column non-header cell.
	cell: (object: Object, objectIndex: number) => Cell;
}