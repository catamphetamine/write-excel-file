import { Feature } from './Feature.d.js'

export interface Options<FileContent> {
	fontFamily?: string;
	fontSize?: number;
	features?: Feature<FileContent>[];
}