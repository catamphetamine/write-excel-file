import addProperties from '../helpers/features/addProperties.js'

export default function getWorkbookParameters(parameters, multipleSheetsParameters, features) {
	const workbookParameters = {
		multipleSheetsParameters,
		features
	}

	// Add any custom properties that're used by plugins.
	addProperties(workbookParameters, parameters, features, 'xl/workbook.xml')

	return workbookParameters
}