// `Readable` type becomes globally available after installing `@types/node`.
// https://stackoverflow.com/questions/49508610/type-for-nodejs-stream-stream-in-typescript
// Or does it?
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/53#note_1245377052
import { Readable, Writable } from 'stream'

export interface ReturnType {
	toBuffer: () => Promise<Buffer>;
	toStream: (() => Promise<Readable>) | ((writableStream: Writable) => Promise<void>);
	toFile: (filePath: string) => Promise<void>;
}