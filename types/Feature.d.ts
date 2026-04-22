import { SheetOptions } from './SheetOptions.js'

// `feature.files.transform` type

interface FeatureTransformFile_<Options, Properties> {
	// Inserts XML markup inside the root element (at its end).
	insert?: (
		options: Options,
		properties: Properties
	) => string | undefined;

	// Transforms XML markup.
	transform?: (
		content: string,
		options: Options,
		properties: Properties
	) => string;
}

interface FeatureTransformFileProperties {}

interface FeatureTransformFilePropertiesWithSheetInfo {
	// `sheetIndex` could be used in file names when creating new files.
	sheetIndex: number;
	// `sheetId` could be used in file names when creating new files.
	sheetId: string;
}

interface FeatureTransformFile<FileContent> extends FeatureTransformFile_<
	SheetOptions<FileContent>[],
	FeatureTransformFileProperties
> {}

interface FeatureTransformFileRelatedToSpecificSheet<FileContent> extends FeatureTransformFile_<
	SheetOptions<FileContent>,
	FeatureTransformFilePropertiesWithSheetInfo
> {}

// `feature.files.write` type

interface FeatureWriteFiles<FileContent> {
	// Writes new files or overwrites existing ones.
	files?: (
		sheetsOptions: SheetOptions<FileContent>[],
		properties: FeatureWriteFilesProperties<FileContent>
	) => Record<string, ReadableFileContent<FileContent>> | undefined;
}

type ReadableFileContent<FileContent> = FileContent | string;

interface FeatureWriteFilesProperties<FileContent> {
	// Reads a file from a certain path inside the `.xlsx` file.
	read(path: string): ReadableFileContent<FileContent> | undefined;
}

// `feature` type

export interface Feature<FileContent> {
	files?: {
		transform?: {
			'[Content_Types].xml'?: FeatureTransformFile<FileContent>,
			'_rels/.rels'?: FeatureTransformFile<FileContent>,
			'xl/styles.xml'?: FeatureTransformFile<FileContent>,
			'xl/workbook.xml'?: FeatureTransformFile<FileContent>,
			'xl/_rels/workbook.xml.rels'?: FeatureTransformFile<FileContent>,
			'xl/worksheets/sheet{id}.xml'?: FeatureTransformFileRelatedToSpecificSheet<FileContent>,
			'xl/worksheets/_rels/sheet{id}.xml.rels'?: FeatureTransformFileRelatedToSpecificSheet<FileContent>,
			'xl/drawings/drawing{id}.xml'?: FeatureTransformFileRelatedToSpecificSheet<FileContent>,
			'xl/drawings/_rels/drawing{id}.xml.rels'?: FeatureTransformFileRelatedToSpecificSheet<FileContent>
		},
		write?: FeatureWriteFiles<FileContent>
	};
}