export interface ImagesParameters<FileContent> {
  images?: ImageType<FileContent>[];
}

// `ImageContent` will differ between server side and client side.
export interface ImageType<FileContent> {
	content: FileContent;
	contentType: string;
	width: number;
	height: number;
	dpi: number;
	anchor: {
		row: number;
		column: number;
	};
	offsetX?: number;
	offsetY?: number;
	title?: string;
	description?: string;
}
