import addProperties from './helpers/features/addProperties.js'

export default function getInitializeStylesParameters(parameters, multipleSheetsParameters, features) {
	const stylesParameters = {
		multipleSheetsParameters
	}

	// Add any custom properties that're used by plugins.
	addProperties(stylesParameters, parameters, features, 'xl/styles.xml')

	return stylesParameters
}