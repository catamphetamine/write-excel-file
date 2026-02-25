import addProperties from '../helpers/features/addProperties.js'

export default function getContentTypesParameters(parameters, multipleSheetsParameters, features) {
	const contentTypesParameters = {
		multipleSheetsParameters,
		features
	}

	// Add any custom properties that're used by plugins.
	addProperties(contentTypesParameters, parameters, features, '[Content_Types].xml')

	return contentTypesParameters
}