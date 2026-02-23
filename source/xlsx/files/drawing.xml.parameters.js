import addProperties from '../helpers/features/addProperties.js'

export default function getDrawingXmlParameters(parameters, multipleSheetsParameters, features) {
	const drawingXmlParameters = {
		multipleSheetsParameters,
		features
	}

	// Add any custom properties that're used by plugins.
	addProperties(drawingXmlParameters, parameters, features, 'xl/drawings/drawing{id}.xml')

	return drawingXmlParameters
}