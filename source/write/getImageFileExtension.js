export default function getImageFileExtension(image) {
	// Discards everything before the slash, and the slash too.
	// Example: "image/jpeg" → "jpeg".
	const extension = image.contentType.replace(/.*\//, '')
	if (!extension) {
		throw new Error('Unsupported image `contentType`: ' + image.contentType)
	}
	return extension
}