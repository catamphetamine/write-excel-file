import addProperties from './helpers/features/addProperties.js'

export default function getInitializeSheetsParameters(parameters, data, features) {
	const {
		schema,
		columns,
		sheet: sheetName,
		sheets: sheetNames,
		getHeaderStyle,
		fontFamily,
		fontSize,
		orientation,
		showGridLines,
		rightToLeft,
		zoomScale,
		dateFormat
	} = parameters

	const sheetsParameters = {
		data,
		features,
		schema,
		columns,
		sheetNames,
		getHeaderStyle,
		fontFamily,
		fontSize,
		orientation,
		showGridLines,
		rightToLeft,
		zoomScale,
		dateFormat
	}

	// Versions before `1.3.4` had a bug:
	// In a "write multiple sheets" scenario, `columns` parameter
	// wasn't required to be an array of `columns` for each sheet.
	if (sheetNames) {
		if (columns) {
			if (!Array.isArray(columns[0])) {
				throw new Error('In a "write multiple sheets" scenario, `columns` parameter must be an array of `columns` for each sheet.')
			}
		}
	}

	// Add any custom properties that're used by plugins.
	addProperties(sheetsParameters, parameters, features, 'xl/worksheets/sheet{id}.xml')

	// Also add any custom styles properties that're used by plugins
	// because styles properties are read from sheets properties.
	addProperties(sheetsParameters, parameters, features, 'xl/styles.xml')

	// If only a single sheet is being written,
	// convert parameters to arrays as if multiple sheets were being written.
	// This way, the code after this wouldn't bother about the parameters being arrays or not.
	if (!sheetNames) {
		return {
			...sheetsParameters,
			multipleSheetsParameters: false,
			sheetNames: [sheetName || 'Sheet1']
		}
	}

	return {
		...sheetsParameters,
		multipleSheetsParameters: true
	}
}