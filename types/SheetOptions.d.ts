import type { ConditionalFormattingParameters } from './features/conditionalFormatting.d.js'
import type { ImagesParameters } from './features/images.d.js'
import type { StickyRowsOrColumnsParameters } from './features/stickyRowsOrColumns.d.js'

type Orientation = 'landscape';

export interface SheetOptionsColumn {
	width?: number;
	hidden?: boolean;
}

export interface SheetOptionsRow {
	height?: number;
	hidden?: boolean;
}

export interface SheetOptions<FileContent> extends StickyRowsOrColumnsParameters, ConditionalFormattingParameters, ImagesParameters<FileContent> {
	sheet?: string;
	orientation?: Orientation;
	showGridLines?: boolean;
	rightToLeft?: boolean;
	zoomScale?: number;
	dateFormat?: string;
	columns?: SheetOptionsColumn[];
	rows?: SheetOptionsRow[];
}
