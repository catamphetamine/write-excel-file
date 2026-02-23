import addProperties from '../helpers/features/addProperties.js'

export default function getRelsParameters(parameters, multipleSheetsParameters, features) {
	const relsParameters = {
		multipleSheetsParameters,
		features
	}

	// Add any custom properties that're used by plugins.
	addProperties(relsParameters, parameters, features, '_rels/.rels')

	return relsParameters
}