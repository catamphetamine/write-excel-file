// Adds properties to `to` object that're used by `features` when performing a `transformName` transform.
export default function addProperties(to, availableParameters, features, transformName) {
	for (const feature of features) {
		const transform = feature.files && feature.files.transform && feature.files.transform[transformName]
		if (transform && transform.parameters) {
			const parameters = transform.parameters(availableParameters)
			for (const parameterName of Object.keys(parameters)) {
				to[parameterName] = parameters[parameterName]
			}
		}
	}
}