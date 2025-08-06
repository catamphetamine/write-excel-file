export default function getFileExtensionForContentType(contentType) {
  if (!contentType) {
    throw new Error('`contentType` is required');
  }
  // Discards everything before the slash, and the slash too.
  // Example: "image/jpeg" → "jpeg".
  var extension = contentType.toLowerCase().replace(/.*\//, '');
  if (!extension) {
    throw new Error('Unsupported `contentType`: ' + contentType);
  }
  return extension;
}
//# sourceMappingURL=getFileExtensionForContentType.js.map