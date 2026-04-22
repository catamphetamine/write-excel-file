// Returns the content that should be inserted by `features` when performing a `transformName` transform.
export default function getAdditionalContent(
	transformName,
	features,
	sheetOptions,
	properties
) {
	let content = ''
	for (const feature of features) {
		const transform = feature.files && feature.files.transform && feature.files.transform[transformName]
		if (transform && transform.insert) {
			const insertedContent = transform.insert(
				sheetOptions,
				properties
			)
			if (insertedContent) {
				content += insertedContent
			}
		}
	}
	return content
}