// Transforms the content by `features` when performing a `transformName` transform.
export default function transformContent(
	content,
	transformName,
	features,
	sheetOptions,
	properties
) {
	for (const feature of features) {
		const transform = feature.files && feature.files.transform && feature.files.transform[transformName]
		if (transform && transform.transform) {
			content = transform.transform(
				content,
				sheetOptions,
				properties
			)
		}
	}
	return content
}