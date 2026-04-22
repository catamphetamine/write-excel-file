export default function getWrittenFiles(
	features,
	sheetsOptions,
	{ read }
) {
	let writtenFiles = {}

	for (const feature of features) {
		if (feature.files && feature.files.write) {
			if (feature.files.write.files) {
				const files = feature.files.write.files(sheetsOptions, { read })
				if (files) {
					writtenFiles = {
						...writtenFiles,
						...files
					}
				}
			}
		}
	}

	return writtenFiles
}