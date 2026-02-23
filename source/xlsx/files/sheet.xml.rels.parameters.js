import addProperties from '../helpers/features/addProperties.js'

export default function getSheetXmlRelsParameters(parameters, multipleSheetsParameters, features) {
	const sheetXmlRelsParameters = {
		multipleSheetsParameters,
		features
	}

	// Add any custom properties that're used by plugins.
	addProperties(sheetXmlRelsParameters, parameters, features, 'xl/worksheets/_rels/sheet{id}.xml.rels')

	return sheetXmlRelsParameters
}