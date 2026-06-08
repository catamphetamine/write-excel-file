import type Stream from 'node:stream'
import type { Blob } from 'node:buffer'

export type FileContent = Stream | Buffer | Blob
