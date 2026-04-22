export interface ReturnType {
	toBlob: () => Promise<Blob>
	toFile: (fileName: string) => Promise<void>;
}