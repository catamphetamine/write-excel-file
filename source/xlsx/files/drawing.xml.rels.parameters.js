import addProperties from '../helpers/features/addProperties.js'

export default function getDrawingXmlRelsParameters(parameters, multipleSheetsParameters, features) {
	const drawingXmlRelsParameters = {
		multipleSheetsParameters,
		features
	}

	// Add any custom properties that're used by plugins.
	addProperties(drawingXmlRelsParameters, parameters, features, 'xl/drawings/_rels/drawing{id}.xml.rels')

	return drawingXmlRelsParameters
}