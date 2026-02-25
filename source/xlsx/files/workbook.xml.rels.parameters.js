import addProperties from '../helpers/features/addProperties.js'

export default function getWorkbookRelsParameters(parameters, multipleSheetsParameters, features) {
	const workbookRelsParameters = {
		multipleSheetsParameters,
		features
	}

	// Add any custom properties that're used by plugins.
	addProperties(workbookRelsParameters, parameters, features, 'xl/_rels/workbook.xml.rels')

	return workbookRelsParameters
}
