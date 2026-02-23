import images from './features/images.js'
import stickyRowsOrColumns from './features/stickyRowsOrColumns.js'

export default function getFeatures(customFeatures) {
	let features = []

	// Add "images" feature implicitly.
	features.push(images)

	// Add "sticky rows or columns" feature implicitly.
	features.push(stickyRowsOrColumns)

	// Custom features might depend on "default" features
	// so the order of inclusion of custom features is after including "default" features.
	if (customFeatures) {
		customFeatures.forEach(validateFeature)
		features = features.concat(customFeatures)
	}

	return features
}

const TRANSFORMABLE_FILES = [
	'[Content_Types].xml',
	'_rels/.rels',
	'xl/styles.xml',
	'xl/workbook.xml',
	'xl/_rels/workbook.xml.rels',
	'xl/worksheets/sheet{id}.xml',
	'xl/worksheets/_rels/sheet{id}.xml.rels',
	'xl/drawings/drawing{id}.xml',
	'xl/drawings/_rels/drawing{id}.xml.rels'
]

function validateFeature(feature) {
	if (feature.files && feature.files.transform) {
		for (const key of Object.keys(feature.files.transform)) {
			if (TRANSFORMABLE_FILES.indexOf(key) < 0) {
				throw new Error(`Unknown file to transform: ${key}`)
			}
		}
	}
}