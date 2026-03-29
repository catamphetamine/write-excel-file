const objects = [
	{
		name: 'John Smith',
		age: 1800,
		dateOfBirth: new Date(),
		graduated: true
	},
	{
		name: 'Alice Brown',
		age: 2600.50,
		dateOfBirth: new Date(),
		graduated: false
	}
]

const schema = [
	{
		column: 'Name',
		type: String,
		format: '@',
		value: student => student.name,
		getCellStyle: (student) => {
			return {
				align: 'right',
				width: 20
			}
		}
	},
	{
		column: 'Cost',
		type: Number,
		format: '#,##0.00',
		width: 12,
		align: 'center',
		value: student => student.age
	},
	{
		column: 'Date of Birth',
		type: Date,
		format: 'mm/dd/yyyy',
		value: student => student.dateOfBirth
	},
	{
		column: 'Graduated',
		type: Boolean,
		value: student => student.graduated
	}
]

export const data = [
	[
		{
			value: 'Cost',
			fontWeight: 'bold'
		},
		{
			value: 'Date of Birth',
			fontWeight: 'bold',
			fontStyle: 'italic',
			height: 48
		},
		{
			value: 'Name',
			fontWeight: 'bold'
		}
	],
	[
		{
			value: 180.00,
			format: '#,##0.00',
			type: Number,
			align: 'center',
			fontWeight: 'bold'
		},
		{
			value: new Date(),
			type: Date,
			format: 'mm/dd/yyyy'
		},
		{
			value: 'John Smith',
			type: String,
			backgroundColor: '#FFFF00'
		},
		{
			value: true,
			type: Boolean
		},
		{
			value: 'HYPERLINK("https://example.com", "A link")',
			type: 'Formula'
		}
	],
	[
		{
			value: 200.50,
			format: '#,##0.00',
			type: Number,
			align: 'right',
			alignVertical: 'top'
		},
		{
			value: new Date(),
			type: Date,
			format: 'mm/dd/yyyy',
			align: 'center',
			alignVertical: 'bottom'
		},
		{
			value: 'Alice Brown\nNew line',
			type: String,
			textColor: '#ff0000',
			backgroundColor: '#ffffff',
			fillPatternStyle: 'darkGray',
			fillPatternColor: '#eeeeee',
			align: 'left',
			wrap: true
		},
		{
			value: false,
			type: Boolean,
			alignVertical: 'center'
		},
		{
			value: 'HYPERLINK("https://google.com", "Google.com")',
			type: 'Formula',
			indent: 2
		}
	]
]

export const columns = [
	{},
	{ width: 14 },
	{ width: 20 }
	// Fourth column missing intentionally
]

export default {
	'data-values': {
		args: () => [
			data.map(row => row.map(cell => cell.value)),
			{ columns, dateFormat: 'dd.mm.yyyy' }
		]
	},

	'data-objects': {
		args: () => [
			data,
			{ columns }
		]
	},

	'data-objects-type-not-specified': {
		args: () => [
			data.map(row => row.map(cell => ({
				...cell,
				type: undefined,
				format: undefined
			}))),
			{
				columns,
				dateFormat: 'mm/dd/yyyy'
			}
		]
	},

	'schema': {
		args: () => [
		objects,
			{
				schema,
				sheet: 'Test Schema'
			}
		]
	},

	'multiple-sheets': {
		args: () => [
			[objects, objects],
			{
				sheets: ['Sheet One', 'Sheet Two'],
				schema: [schema, schema]
			}
		]
	},

	'schema-header-style': {
		args: () => [
			objects,
			{
				schema,
				getHeaderStyle: (columnSchema) => ({
					align: 'center',
					textColor: '#cc0000',
					backgroundColor: '#eeeeee'
				})}
		]
	},

	'schema-no-column-title-above-one-column': {
		args: () => {
			const schemaNoColumnTitleAboveOneColumn = schema.slice()
			schemaNoColumnTitleAboveOneColumn[1] = {
				...schemaNoColumnTitleAboveOneColumn[1],
				column: undefined
			}
			return [
				objects,
				{ schema: schemaNoColumnTitleAboveOneColumn }
			]
		}
	},

	'schema-no-column-titles': {
		args: () => {
			const schemaNoColumnTitles = schema.slice()
			for (let i = 0; i < schemaNoColumnTitles.length; i++) {
				schemaNoColumnTitles[i] = {
					...schemaNoColumnTitles[i],
					column: undefined
				}
			}

			return [
				objects,
				{ schema: schemaNoColumnTitles }
			]
		}
	},

	'right-to-left': {
		args: () => [
			data,
			{
				columns,
				rightToLeft: true
			}
		]
	},

	'custom-default-font': {
		args: () => [
			data,
			{
				columns,
				fontFamily: 'Times New Roman',
				fontSize: 16
			}
		]
	},

	'custom-font': {
		args: () => {
			const dataWithCustomFontInOneCell = data.slice()
			dataWithCustomFontInOneCell[0] = dataWithCustomFontInOneCell[0].slice()
			dataWithCustomFontInOneCell[0][0] = {
				...dataWithCustomFontInOneCell[0][0],
				fontFamily: 'Courier New',
				fontSize: 8
			}

			return [
				dataWithCustomFontInOneCell,
				{ columns }
			]
		}
	},

	'text-rotation': {
		args: () => {
			const dataWithTextRotation = data.slice()
			dataWithTextRotation[0] = dataWithTextRotation[0].slice()
			dataWithTextRotation[0][0] = {
				...dataWithTextRotation[0][0],
				fontFamily: 'Courier New',
				fontSize: 8,
				textRotation: -90
			}
			dataWithTextRotation[0][1] = {
				...dataWithTextRotation[0][1],
				fontFamily: 'Courier New',
				fontSize: 8,
				textRotation: 90
			}

			return [
				dataWithTextRotation,
				{ columns }
			]
		}
	},

	'sticky-row': {
		args: () => [
			data,
			{ columns, stickyRowsCount: 1 }
		]
	},

	'sticky-rows': {
		args: () => [
			data,
			{ columns, stickyRowsCount: 2 }
		]
	},

	'sticky-column': {
		args: () => [
			data,
			{ columns, stickyColumnsCount: 1 }
		]
	},

	'sticky-columns': {
		args: () => [
			data,
			{ columns, stickyColumnsCount: 2 }
		]
	},

	'sticky-row-and-column': {
		args: () => [
			data,
			{ columns, stickyRowsCount: 1, stickyColumnsCount: 1 }
		]
	},

	'row-span': {
		args: () => {
			// Create `data` with `rowSpan`.
			const dataRowSpan = data.slice()
			let i = 0
			while (i < dataRowSpan.length) {
				dataRowSpan[i] = dataRowSpan[i].slice()
				i++
			}
			dataRowSpan[1][0] = {
				...dataRowSpan[1][0],
				rowSpan: 2,
				// Add test styles.
				// https://gitlab.com/catamphetamine/write-excel-file/-/issues/43
				borderStyle: 'thick',
				borderColor: '#cc0000'
			}
			dataRowSpan[2][0] = null

			return [
				dataRowSpan,
				{ columns }
			]
		}
	},

	'column-span': {
		args: () => {
			// Create `data` with `span`.
			const dataSpan = data.slice()
			let i = 0
			while (i < dataSpan.length) {
				dataSpan[i] = dataSpan[i].slice()
				i++
			}
			dataSpan[1][0] = {
				value: 'Column Span',
				span: 2,
				// Add test styles.
				// https://gitlab.com/catamphetamine/write-excel-file/-/issues/43
				borderStyle: 'thick',
				borderColor: '#cc0000'
			}
			dataSpan[1][1] = null

			return [
				dataSpan,
				{ columns }
			]
		}
	},

	'orientation-landscape': {
		args: () => [
			data,
			{ columns, orientation: 'landscape' }
		]
	},

	'multiple-sheets': {
		args: () => [
			[data, data],
			{
				sheets: ['Sheet One', 'Sheet Two'],
				columns: [columns, columns]
			}
		]
	},

	'hide-grid-lines': {
		args: () => [
			data,
			{ columns, showGridLines: false }
		]
	},

	'zoom-scale': {
		args: () => [
			data,
			{
				columns,
				zoomScale: 1.5
			}
		]
	},

	'custom-feature-sensitivity-label': {
		args: () => {
			const sensitivityLabelsDefinitionFilePath = 'docMetadata/LabelInfo.xml'
			const sensitivityLabelsRelationshipId = 'rId-sensitivityLabels-1'

			const getFeatureParameters = (availableParameters) => {
				const {
					sensitivityLabelId,
					sensitivityLabelSiteId,
					sensitivityLabelAssignmentMethod,
					sensitivityLabelContentBits
				} = availableParameters

				return {
					sensitivityLabelId,
					sensitivityLabelSiteId,
					sensitivityLabelAssignmentMethod,
					sensitivityLabelContentBits
				}
			}

			const customFeature = {
				files: {
					transform: {
						'[Content_Types].xml': {
							insert: ({ sensitivityLabelId, sensitivityLabelSiteId, sensitivityLabelAssignmentMethod, sensitivityLabelContentBits }, { attributeValue, textContent }) => {
								if (sensitivityLabelId) {
									return `<Override ContentType="application/vnd.ms-office.classificationlabels+xml" PartName="/${sensitivityLabelsDefinitionFilePath}"/>`
								}
							},

							parameters: getFeatureParameters
						},

						'_rels/.rels': {
							insert: ({ sensitivityLabelId, sensitivityLabelSiteId, sensitivityLabelAssignmentMethod, sensitivityLabelContentBits }, { attributeValue, textContent }) => {
								if (sensitivityLabelId) {
									return `<Relationship Id="${sensitivityLabelsRelationshipId}" Type="http://schemas.microsoft.com/office/2020/02/relationships/classificationlabels" Target="${sensitivityLabelsDefinitionFilePath}"/>`
								}
							},

							parameters: getFeatureParameters
						}
					},

					write: {
						files: ({ sensitivityLabelId, sensitivityLabelSiteId, sensitivityLabelAssignmentMethod, sensitivityLabelContentBits }, { attributeValue, textContent }) => {
							if (sensitivityLabelId) {
								if (!sensitivityLabelSiteId) {
									throw new Error('When `sensitivityLabelId` parameter is specified, `sensitivityLabelSiteId` parameter must be specified too')
								}
								if (sensitivityLabelContentBits !== undefined && typeof sensitivityLabelContentBits !== 'number') {
									throw new Error('When `sensitivityLabelContentBits` parameter is specified, it should be a number')
								}
								return {
									[sensitivityLabelsDefinitionFilePath]:
										'<?xml version="1.0" encoding="utf-8" standalone="yes"?>' +
										'<clbl:labelList xmlns:clbl="http://schemas.microsoft.com/office/2020/mipLabelMetadata">' +
											`<clbl:label id="${attributeValue(sensitivityLabelId)}" siteId="${attributeValue(sensitivityLabelSiteId)}" method="${attributeValue(sensitivityLabelAssignmentMethod)}" contentBits="${attributeValue(String(sensitivityLabelContentBits || 0))}" enabled="1" removed="0" />` +
										'</clbl:labelList>'
								}
							}
						},

						parameters: getFeatureParameters
					}
				}
			}

			return [
				data,
				{
					columns,
					features: [customFeature],

					// Sensitivity label IDs are GUIDs (Globally Unique Identifiers) used to
					// programmatically apply classification settings.
					//
					// Common Sensitivity Label ID Examples (based on Microsoft Information Protection examples):
					// * Personal: 73c47c6a-eb00-4a6a-8e19-efaada66dee6
					// * Public: 73254501-3d5b-4426-979a-657881dfcb1e
					// * General: da480625-e536-430a-9a9e-028d16a29c59
					// * Confidential: 569af77e-61ea-4deb-b7e6-79dc73653959
					// * Highly Confidential: 905845d6-b548-439c-9ce5-73b2e06be157
					//
					sensitivityLabelId: '569af77e-61ea-4deb-b7e6-79dc73653959',

					// Site ID is a unique identifier (GUID) for your organization's Microsoft 365 tenant,
					// required to enforce policy persistence and identify the label's source.
					// Example: "5f0d8a9b-e21a-4c4c-87d2-7c9d3f1a2b3c".
					sensitivityLabelSiteId: '5f0d8a9b-e21a-4c4c-87d2-7c9d3f1a2b3c',

					// The manner in which the label was applied (e.g., manual, automatic, recommended).
					sensitivityLabelAssignmentMethod: 'Privileged',

					// ContentBits definine active protection features.
					// Common ContentBits examples:
					// * 0 (no protection)
					// * 2 (encryption applied)
					// * 8 (content markings applied)
					// * combinations like 10 (encryption + marking)
					sensitivityLabelContentBits: 0
				}
			]
		}
	},

	'custom-feature-replace-yellow-with-green': {
		args: () => {
			const customFeature = {
				files: {
					transform: {
						'xl/styles.xml': {
							transform: (xml, { customParameter }, {}) => {
								return xml.replaceAll('FFFF00', '00FF00')
							},

							parameters: (availableParameters) => {
								const { customParameter } = availableParameters
								return { customParameter }
							}
						}
					}
				}
			}

			return [
				data,
				{
					columns,
					customParameter: 'customValue',
					features: [customFeature]
				}
			]
		}
	},

	'conditional-formatting': {
		args: () => [
			data,
			{
				columns,
				conditionalFormatting: [{
					cellRange: {
						from: {
							row: 2,
							column: 1
						},
						to: {
							row: 3,
							column: 1
						}
					},
					condition: {
						operator: '>',
						value: 200
					},
					style: {
						backgroundColor: '#cc0000',
						fontStyle: 'italic',
						textDecoration: {
							underline: true
						}
					}
				}]
			}
		]
	},

	'images-on-multiple-sheets': {
		args: () => [
			[data, data],
			{
				sheets: ['Sheet One', 'Sheet Two'],
				columns: [columns, columns],
				images: [
					[
						{
							content: dataURLToBlob('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG8AAABvCAYAAADixZ5gAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDYwLCAyMDIwLzA1LzEyLTE2OjA0OjE3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAyLTIzVDEzOjUwOjQ4KzAzOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI1LTAyLTIzVDEzOjUwOjQ4KzAzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMi0yM1QxMzo1MDo0OCswMzowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0NzRlOTcyYi1lNGE1LTExNDItOTJlOC1hYTc3ZTUwMDY2MjgiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1NDVmZDVjNS0xZDRlLTVhNGQtODg0Ny0wNzE4MmFlYjAxMjYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplYTA1ZjQzYS1hODNlLWYwNGUtOGY5NC02ZWQyZDFkMzk5ZTMiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmVhMDVmNDNhLWE4M2UtZjA0ZS04Zjk0LTZlZDJkMWQzOTllMyIgc3RFdnQ6d2hlbj0iMjAyNS0wMi0yM1QxMzo1MDo0OCswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NzRlOTcyYi1lNGE1LTExNDItOTJlOC1hYTc3ZTUwMDY2MjgiIHN0RXZ0OndoZW49IjIwMjUtMDItMjNUMTM6NTA6NDgrMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4yIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6a+I0uAAAEfElEQVR42u2d3a3kIAyFXQR90Aid0Am90AiF0MbswxJtNDt/gAEbDhIPV5rcAB8+2A4hRHqLJSJPRIGIIhElIspE9PhQc/ldLNd5InJEZAhlWDE3UN8A9dRU7uEw5P2WNRrWtxrLpIFlKgH2ySphkS+KK4PzUFIDrPGvJGVF0F7Jqj3R0jRDewVxe0u0yuQRclo6FDaG9hxLup0k8nFgVS+l4VBw9+o0rm0zHJL0lOayZbabN9JtX6TVZrQzQCb/ZTy43XNT2j0yQSBeRv2gTrsFyjEiBs1SAQbmTkrJKdoygTghigrsIzO0E8IduxM4qdBGWqLVLpVasxJcKT6rEVzeJKnLMYGnTl5PyAFyxrXTvFB7yNrW4tD0JN3TjAZu4yILlNGhmZhEmwWnApcVJ6lBp4HjAMg6XhbgpgKMq+XydHC9AN3Km1tw63Ziuia/oUMeQApNI4bZM8aD01tDyLMUrMVJSWDEPqZxlpnDQRmjZnb0DIFc/l7ySOurtTrI5Xj5/Mn6DO0RFtx3i32qq6Q+jrA+TwuzAUyzOihQjRYj+TrRMul0UlpfE1sp+bXOi/82AJo2k16vO/c8CE2L28/W1tqZYBfLI9eua02Zl7djrqnTu8CzHNJZ+08c4C2J+xKHZBLgsZVaD/8/J7HGU4uAt9RxcWwXAx5LqTGe0BMiGMBbGvPl1guldPaK8V7VqLA/tZOxKdbQ8JanJ51J9aZ4r8ZVdYAnYt3zLcQN4IlY90KLp0mAJ6LdsdbTzIA3tLjadjvS++xuN3i21pA87eVpaoZXvYQFwBNVhsHzgAd4gAd4gAd4h8CDwyIMHkKFQ+AhSBcW5zna752EYzIs1RcAnpzcJp4q6Gx3bFkkLeANK007Gpqe4AIee2na0bBbrKcRnmlVwJrOZsBb7qw8Wl1UDftYNMLr2n650+EBGuHVrHehx9NJgLcsOH/p8fuNpFMbvO43tOxG0qkNHssBDjW6mwFviZfpODoteeu7Jni1J1gYrkAxAd5URyVyzwQHeNOs7utYuw2s7/pUzC81LGxj7bHP7AEjTradY3V+hOzgrM2xsl49vi2HmgUwkTO2LbMD8skvl02q1nqyO+ST1yDCzJvh1FuemI7FGDJh/VuxzrHkj+2qG28Ebukhrq2fU4ED0/7ZOss5ezIAVpcoRbV6zvpyALfe4ev5pOYpa2Dvt2ONxBl1ghfa+9VmN2Nm9TQwbhrIu44xmapMvWdd5s3Wwd4P3YcVEvFgaLQ5WCaXZqQcA0CNVmgYrE1EKpED4NWR3V4f+9ZfEarDBfByaJxAS/OMfRQDbgTAq4N+cSctkzyqOJSBYwH/ZI1mIrAR/RAf5/ZmGH6xyMAI01L9ifDbZ5jC4MF4BhrLPe9H9LtSr79DqXGQZb3zpi0pLG7iIEms6rNJZoIkSaxbPUk5xQq1Z42mBLnSatK6tq1KL0mBduRuAc0Qj4X2Tk4T6VjTLHDNz3D0uPyrU3VqQSYA078+ukEZknTLzkASJ1vnuxRYvKXNwg2QK9eptqo/VC2Bc3pK+xQAAAAASUVORK5CYII='),
							contentType: 'image/png',
							width: 48,
							height: 48,
							dpi: 72,
							anchor: {
								row: 1,
								column: 1
							}
						},
						{
							content: dataURLToBlob('data:image/jpeg;base64,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b2wAAAAAAENsYnJib29sAAAAAABSZ3NNYm9vbAAAAAAAQ3JuQ2Jvb2wAAAAAAENudENib29sAAAAAABMYmxzYm9vbAAAAAAATmd0dmJvb2wAAAAAAEVtbERib29sAAAAAABJbnRyYm9vbAAAAAAAQmNrZ09iamMAAAABAAAAAAAAUkdCQwAAAAMAAAAAUmQgIGRvdWJAb+AAAAAAAAAAAABHcm4gZG91YkBv4AAAAAAAAAAAAEJsICBkb3ViQG/gAAAAAAAAAAAAQnJkVFVudEYjUmx0AAAAAAAAAAAAAAAAQmxkIFVudEYjUmx0AAAAAAAAAAAAAAAAUnNsdFVudEYjUHhsQFIAAAAAAAAAAAAKdmVjdG9yRGF0YWJvb2wBAAAAAFBnUHNlbnVtAAAAAFBnUHMAAAAAUGdQQwAAAABMZWZ0VW50RiNSbHQAAAAAAAAAAAAAAABUb3AgVW50RiNSbHQAAAAAAAAAAAAAAABTY2wgVW50RiNQcmNAWQAAAAAAAAAAABBjcm9wV2hlblByaW50aW5nYm9vbAAAAAAOY3JvcFJlY3RCb3R0b21sb25nAAAAAAAAAAxjcm9wUmVjdExlZnRsb25nAAAAAAAAAA1jcm9wUmVjdFJpZ2h0bG9uZwAAAAAAAAALY3JvcFJlY3RUb3Bsb25nAAAAAAA4QklNA+0AAAAAABAASAAAAAEAAQBIAAAAAQABOEJJTQQmAAAAAAAOAAAAAAAAAAAAAD+AAAA4QklNBA0AAAAAAAQAAABaOEJJTQQZAAAAAAAEAAAAHjhCSU0D8wAAAAAACQAAAAAAAAAAAQA4QklNJxAAAAAAAAoAAQAAAAAAAAABOEJJTQP1AAAAAABIAC9mZgABAGxmZgAGAAAAAAABAC9mZgABAKGZmgAGAAAAAAABADIAAAABAFoAAAAGAAAAAAABADUAAAABAC0AAAAGAAAAAAABOEJJTQP4AAAAAABwAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAADhCSU0EAAAAAAAAAgABOEJJTQQCAAAAAAAEAAAAADhCSU0EMAAAAAAAAgEBOEJJTQQt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dHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMS4yIChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjUtMDItMjNUMTM6NTE6MTArMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjUtMDItMjNUMTM6NTE6MTArMDM6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI1LTAyLTIzVDEzOjUxOjEwKzAzOjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhlNjczZGY2LTdjNTktMzM0NC1hMGZmLTAyODYyNjAwYjI3NyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjE0MjBhMmYwLWQzNDYtMDM0ZS1hZWQzLWY1YmY2ZmU0OWNiMyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmUyZWVjYzI0LWYxMDktOWU0YS1hZDQ1LTQ5OGE1OGY3Yzc0NCIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmUyZWVjYzI0LWYxMDktOWU0YS1hZDQ1LTQ5OGE1OGY3Yzc0NCIgc3RFdnQ6d2hlbj0iMjAyNS0wMi0yM1QxMzo1MToxMCswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo4ZTY3M2RmNi03YzU5LTMzNDQtYTBmZi0wMjg2MjYwMGIyNzciIHN0RXZ0OndoZW49IjIwMjUtMDItMjNUMTM6NTE6MTArMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4yIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/Pv/iDFhJQ0NfUFJPRklMRQABAQAADEhMaW5vAhAAAG1udHJSR0IgWFlaIAfOAAIACQAGADEAAGFjc3BNU0ZUAAAAAElFQyBzUkdCAAAAAAAAAAAAAAABAAD21gABAAAAANMtSFAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEWNwcnQAAAFQAAAAM2Rlc2MAAAGEAAAAbHd0cHQAAAHwAAAAFGJrcHQAAAIEAAAAFHJYWVoAAAIYAAAAFGdYWVoAAAIsAAAAFGJYWVoAAAJAAAAAFGRtbmQAAAJUAAAAcGRtZGQAAALEAAAAiHZ1ZWQAAANMAAAAhnZpZXcAAAPUAAAAJGx1bWkAAAP4AAAAFG1lYXMAAAQMAAAAJHRlY2gAAAQwAAAADHJUUkMAAAQ8AAAIDGdUUkMAAAQ8AAAIDGJUUkMAAAQ8AAAIDHRleHQAAAAAQ29weXJpZ2h0IChjKSAxOTk4IEhld2xldHQtUGFja2FyZCBDb21wYW55AABkZXNjAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAAEnNSR0IgSUVDNjE5NjYtMi4xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYWVogAAAAAAAA81EAAQAAAAEWzFhZWiAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAG+iAAA49QAAA5BYWVogAAAAAAAAYpkAALeFAAAY2lhZWiAAAAAAAAAkoAAAD4QAALbPZGVzYwAAAAAAAAAWSUVDIGh0dHA6Ly93d3cuaWVjLmNoAAAAAAAAAAAAAAAWSUVDIGh0dHA6Ly93d3cuaWVjLmNoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGRlc2MAAAAAAAAALklFQyA2MTk2Ni0yLjEgRGVmYXVsdCBSR0IgY29sb3VyIHNwYWNlIC0gc1JHQgAAAAAAAAAAAAAALklFQyA2MTk2Ni0yLjEgRGVmYXVsdCBSR0IgY29sb3VyIHNwYWNlIC0gc1JHQgAAAAAAAAAAAAAAAAAAAAAAAAAAAABkZXNjAAAAAAAAACxSZWZlcmVuY2UgVmlld2luZyBDb25kaXRpb24gaW4gSUVDNjE5NjYtMi4xAAAAAAAAAAAAAAAsUmVmZXJlbmNlIFZpZXdpbmcgQ29uZGl0aW9uIGluIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdmlldwAAAAAAE6T+ABRfLgAQzxQAA+3MAAQTCwADXJ4AAAABWFlaIAAAAAAATAlWAFAAAABXH+dtZWFzAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAACjwAAAAJzaWcgAAAAAENSVCBjdXJ2AAAAAAAABAAAAAAFAAoADwAUABkAHgAjACgALQAyADcAOwBAAEUASgBPAFQAWQBeAGMAaABtAHIAdwB8AIEAhgCLAJAAlQCaAJ8ApACpAK4AsgC3ALwAwQDGAMsA0ADVANsA4ADlAOsA8AD2APsBAQEHAQ0BEwEZAR8BJQErATIBOAE+AUUBTAFSAVkBYAFnAW4BdQF8AYMBiwGSAZoBoQGpAbEBuQHBAckB0QHZAeEB6QHyAfoCAwIMAhQCHQImAi8COAJBAksCVAJdAmcCcQJ6AoQCjgKYAqICrAK2AsECywLVAuAC6wL1AwADCwMWAyEDLQM4A0MDTwNaA2YDcgN+A4oDlgOiA64DugPHA9MD4APsA/kEBgQTBCAELQQ7BEgEVQRjBHEEfgSMBJoEqAS2BMQE0wThBPAE/gUNBRwFKwU6BUkFWAVnBXcFhgWWBaYFtQXFBdUF5QX2BgYGFgYnBjcGSAZZBmoGewaMBp0GrwbABtEG4wb1BwcHGQcrBz0HTwdhB3QHhgeZB6wHvwfSB+UH+AgLCB8IMghGCFoIbgiCCJYIqgi+CNII5wj7CRAJJQk6CU8JZAl5CY8JpAm6Cc8J5Qn7ChEKJwo9ClQKagqBCpgKrgrFCtwK8wsLCyILOQtRC2kLgAuYC7ALyAvhC/kMEgwqDEMMXAx1DI4MpwzADNkM8w0NDSYNQA1aDXQNjg2pDcMN3g34DhMOLg5JDmQOfw6bDrYO0g7uDwkPJQ9BD14Peg+WD7MPzw/sEAkQJhBDEGEQfhCbELkQ1xD1ERMRMRFPEW0RjBGqEckR6BIHEiYSRRJkEoQSoxLDEuMTAxMjE0MTYxODE6QTxRPlFAYUJxRJFGoUixStFM4U8BUSFTQVVhV4FZsVvRXgFgMWJhZJFmwWjxayFtYW+hcdF0EXZReJF64X0hf3GBsYQBhlGIoYrxjVGPoZIBlFGWsZkRm3Gd0aBBoqGlEadxqeGsUa7BsUGzsbYxuKG7Ib2hwCHCocUhx7HKMczBz1HR4dRx1wHZkdwx3sHhYeQB5qHpQevh7pHxMfPh9pH5Qfvx/qIBUgQSBsIJggxCDwIRwhSCF1IaEhziH7IiciVSKCIq8i3SMKIzgjZiOUI8Ij8CQfJE0kfCSrJNolCSU4JWgllyXHJfcmJyZXJocmtyboJxgnSSd6J6sn3CgNKD8ocSiiKNQpBik4KWspnSnQKgIqNSpoKpsqzysCKzYraSudK9EsBSw5LG4soizXLQwtQS12Last4S4WLkwugi63Lu4vJC9aL5Evxy/+MDUwbDCkMNsxEjFKMYIxujHyMioyYzKbMtQzDTNGM38zuDPxNCs0ZTSeNNg1EzVNNYc1wjX9Njc2cjauNuk3JDdgN5w31zgUOFA4jDjIOQU5Qjl/Obw5+To2OnQ6sjrvOy07azuqO+g8JzxlPKQ84z0iPWE9oT3gPiA+YD6gPuA/IT9hP6I/4kAjQGRApkDnQSlBakGsQe5CMEJyQrVC90M6Q31DwEQDREdEikTORRJFVUWaRd5GIkZnRqtG8Ec1R3tHwEgFSEtIkUjXSR1JY0mpSfBKN0p9SsRLDEtTS5pL4kwqTHJMuk0CTUpNk03cTiVObk63TwBPSU+TT91QJ1BxULtRBlFQUZtR5lIxUnxSx1MTU19TqlP2VEJUj1TbVShVdVXCVg9WXFapVvdXRFeSV+BYL1h9WMtZGllpWbhaB1pWWqZa9VtFW5Vb5Vw1XIZc1l0nXXhdyV4aXmxevV8PX2Ffs2AFYFdgqmD8YU9homH1YklinGLwY0Njl2PrZEBklGTpZT1lkmXnZj1mkmboZz1nk2fpaD9olmjsaUNpmmnxakhqn2r3a09rp2v/bFdsr20IbWBtuW4SbmtuxG8eb3hv0XArcIZw4HE6cZVx8HJLcqZzAXNdc7h0FHRwdMx1KHWFdeF2Pnabdvh3VnezeBF4bnjMeSp5iXnnekZ6pXsEe2N7wnwhfIF84X1BfaF+AX5ifsJ/I3+Ef+WAR4CogQqBa4HNgjCCkoL0g1eDuoQdhICE44VHhauGDoZyhteHO4efiASIaYjOiTOJmYn+imSKyoswi5aL/IxjjMqNMY2Yjf+OZo7OjzaPnpAGkG6Q1pE/kaiSEZJ6kuOTTZO2lCCUipT0lV+VyZY0lp+XCpd1l+CYTJi4mSSZkJn8mmia1ZtCm6+cHJyJnPedZJ3SnkCerp8dn4uf+qBpoNihR6G2oiailqMGo3aj5qRWpMelOKWpphqmi6b9p26n4KhSqMSpN6mpqhyqj6sCq3Wr6axcrNCtRK24ri2uoa8Wr4uwALB1sOqxYLHWskuywrM4s660JbSctRO1irYBtnm28Ldot+C4WbjRuUq5wro7urW7LrunvCG8m70VvY++Cr6Evv+/er/1wHDA7MFnwePCX8Lbw1jD1MRRxM7FS8XIxkbGw8dBx7/IPci8yTrJuco4yrfLNsu2zDXMtc01zbXONs62zzfPuNA50LrRPNG+0j/SwdNE08bUSdTL1U7V0dZV1tjXXNfg2GTY6Nls2fHadtr724DcBdyK3RDdlt4c3qLfKd+v4DbgveFE4cziU+Lb42Pj6+Rz5PzlhOYN5pbnH+ep6DLovOlG6dDqW+rl63Dr++yG7RHtnO4o7rTvQO/M8Fjw5fFy8f/yjPMZ86f0NPTC9VD13vZt9vv3ivgZ+Kj5OPnH+lf65/t3/Af8mP0p/br+S/7c/23////uACFBZG9iZQBkQAAAAAEDABADAgMGAAAAAAAAAAAAAAAA/9sAhAACAgICAgICAgICAwICAgMEAwICAwQFBAQEBAQFBgUFBQUFBQYGBwcIBwcGCQkKCgkJDAwMDAwMDAwMDAwMDAwMAQMDAwUEBQkGBgkNCgkKDQ8ODg4ODw8MDAwMDA8PDAwMDAwMDwwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wgARCABvAG8DAREAAhEBAxEB/8QAlwAAAwEBAQEBAQAAAAAAAAAAAAkKCAcFBgIDAQEAAAAAAAAAAAAAAAAAAAAAEAACAgMAAgIDAQAAAAAAAAAHCAUGAwQJABAgAnABFhkRAAICAQMDAgMGBAMJAAAAAAECAwQFEQYHACESMRNBIhQQIFFhFQhxMkIWYpJTkVIjMySU1Rc3EgEAAAAAAAAAAAAAAAAAAABw/9oADAMBAQIRAxEAAAB/gAcfEiizTNB+TTIzUdudgAAAVcTGnojVzX4GRBUh5xTgNTABXhKeNuKTD7kAA+GJrxSpVYNHOZkS4yAqRP2AAAH4JaBcpZgKcEOFv50sBCwus9gfwbtA5oRADZDLB3cqWABKZnYVCboKqwAlnMFH8h0g+4AA5qRjDYiiEAEIk+J3YcYP6ADnZIieqV3H14AIFECDDz6ErFACRwXMMqNRFGAASdGXx4xNwWxmgwJ7TkAHXyhIDPhE4PIH9EVh28rpPfAAADwCRY4gWZnRDE5IOa7KdzTwABmEmIMiFfBtgAMZEtJm83ia7AyIYONIFSxs0AAD5USALHM1gaVGbjvz6oAP/9oACAECAAEFAPyJ/9oACAEDAAEFAPyJ/9oACAEBAAEFAPZmPgiX6tHPtVP7mUgPM25LyzNisFi2ImwT0DlH7zNuNMoQ7WTetnDJ8ETA1r4vd0mrC2+EYmX8u2sXBwomuwjDisarFrwvExf8GCa4mL/nwFPisZa7gKIcKIUsI5Jl/EVrRLpRWWS+/vpK8v2WWn7u7uSW4iPMacPWoOhnQBJVvgRRnQC3Vns5jTwC1NLd3I3c5svL9WVpvhkKlaCIuLxTtZsJXMRHdRgLXjx48OP5ZMePNj6eJDqr5bxCU7WEyVCMZTrGsna42Z9KIHdEsBPvgdFVVCAx9PD07PANPkp1EeKTy1Pqs69Z30ad6uOJUfRiFVVN4xIlEsAwviBGzPuqF0sv2e/ubx0GOK4tB7a/lXdGKP8A9+IBI/X0YIE3Nbipx5mt2Lb732LGmCntGBL9noFnZOSzzDE8OIjH9Ir4FwuUEHUFmTtNskbOLQHmNi1++48Rj+8V40UPmgGU4cT2P94fZVKtECtEc1yLu3RASVKLo3l4oNDqYvpnvuPPY/1h19bY28nVId5aC5fJcr4Ry23vpYyJHMLCeDLqUeg7SF36uMwUjt760FfCRm2V4d5b9ZezAJz3ARwE7L1edVw9wTKBH0wHJE/lg3/4ost5/iiy3i/8kT+Jzf6aM9wS1hGfnZe0TqMAnPT+flxqNfv1TaNfLKsZoQhzpZSSXVbVW7xXflarVW6PXX3c6WbYlq4vllZw0YRVRdcVePCnVbbgZXmi28aWxPHyKyly68OCBWci/gw7ggVY4tw3yKzaS9GotvJdsR5Oq2o4y9t6kgrbiuMepBsV2w6e5uR20LemjiC3BC9ui/g15rt0X8+uUumjiFLBubm5I7S4KQbGisKhJIK1HrnxvH8R/JG5LuZ5FzENKdmqZZQV2eIyxYrs8vlHyT7FqzBFLuZ46zUf+I/kvf8A/9oACAECAgY/AET/2gAIAQMCBj8ARP/aAAgBAQEGPwD7Tuvlve+P2jjpA4x1WdjJevSJprHSpxB552HkNfBCFB1Yqvfq3h/28cb18NSBKRb03l/1Nt1IILQ4yrIIoWB0KtJPKCPWMdSvuXnrddevKSWxuCt/oNUqT2RoMUKqOB8PMN+Pr36e3uDO5HO2pG85LOQtS2pGbQL5FpWYk6ADXoT4LN38LOCSJqFmWs+pUqT5RMp9CR/DqJ9tc9brsV4iCuNztv8AXqoUHuiwZUWkQH4+AX8fXv1TxP7hOM6+UosfGfeWzGMFmNfg0mMtyNHKf94pYj0Hoh9OhuviTe+P3djowgyNWBjHeoyPrpHdpyhJ4GPidPNAGA1Usvf71vjTi1KO9+apY2XJe43u43bYZfke74Ee7ZbXVK4YeI+eUqPBJMhvjkvdmR3nurJ6C1mMjL7jhFJKxRINEiiTyPhHGqovoqjobW4q2Llt85sBWsV8ZAXjrI2oWS1YbxhroSCA8rquvbXXqtd5T5L27xpFOvm+KxsEu4L8R0/klCyU6wOvbWOeQD17+nUK7h5V5ByllU0sS458VQRn0HdUmoXCo117Fj/HqZdvcq8g4uyyaV5ci+Kvor6HuyQ0KZYa6dgw/j1YvcT8l7f5KhhQyLh8pBJt/ISHvpHDrJcrOfT5pJogfy9OjtblXYuW2NmyGavXycBSOyi6BpKthfKGwgJALxOy69tdesfvjjTdmR2ZurGairmMdL7blGILRSodUlifxHnHIrI3oynqnxlylFS2TzTHCBjnjcRYzcYQfM1ISMTFZHq1ck+Q+aIkeSR/bX4645uxnm7flNpqNvRZBgMWzNE2RdG1DTSsrJXUgjyVpG7IEkt5HI25r+QvzSWb16zI0s000rF5JJJHJZmZiSSTqT3PWH5a5sa9tDiGwyWsBt2INXyu5IRoyyq7DWtSk17Sge5KuvteCsk3VDZXGu0sdsza+NXSticbCI0LEaNLK51eWRtNWkkZnY92Yn7t/ZXJW0sdvPa+SXSziclCJEDAaLLE40eKRddVkjZXU91YHrKcrcKNkN6cQ1vO1uHCTj38rtyIfM0sjIAbNNO+svj5xL/zfJVaU1Mjjrc1DIUJo7NG9WkaKaGaJg8ckciEMrKwBBB1B7jp+NuR8hGvN2xKatZtuVT+4cWhEa5BF/14iVWyoGhJWRezssfW+OV93zCLA7IxcuQsReYR7M3aOtUiZtR7lmd0hj1/rdet4cpb2t/V7j3lkJL1wLr7UEZ0SCtCDqRFBEqxID3CqNST36n5g5Twxt8P7FuLHi8LaT/p9xZiMh/YkVhpJVrDRph/K7FYj5L7qhIokWKKJQkUSAKqqo0AAHYAD77xSossUqlJYnAZWVhoQQexBHVfl3jDEfScPcgXniu4aqgWDbuZcGT6VFB+WtZAd4AB4xlXi+VREG2fylsm39JuPZuQjvUw2vtTxjVJ60wGhMU8TNE4Hcqx0IPfqb90GCrTZTaVfYuQ3tPhoJI2tL+lU5rF7HGTX2/fglryV37+IkU/Dri/9v8Aibnt/rTyby3lBG+jNXrs9TFxOoOpR5fqHIbt5Roe5HbZ/HW1a31e4t7ZinhcPEdfATXJViV5CAfGNPLydvRVBY9h1svirZlYV9vbLxsVGtIVVZLMvd7NubxABlszM80hHYux+3kHhPjbbu0aGK2d+nRxblyVS1eyMr3sXVvMwH1UVdArWSoBib0Hf1HUrjmn9NhkOqVKWAwMSR+nZXOPaT4f1OeoLV/krH70pQt5Phc7gsYYJe+pDy0a9OzofT5Zh+XWaMuEGz+S9kiuN5bXSRpqskVnzWG9RlcBmikaNgyNq8TfKxYFHf7N6cVbzrCxt7emNlo2ZAqtJWl7PWtw+QIEtaZUmjJ7B1HW8OOt1VvpNxbJzFzC5iIa+BmpytEzxkgeUb+PkjejKQw7Hr9837f8tc9z9F4t3dvLZsEj6stexhbNTKRIpOoRJfp3AXt5SOexPfmGY2TPQ2lbqbWxMXwhTE1Y4bEY7A97fvv/ABb8Oslvq9W92jxRti5kKcxHkq5PJsuOrqR6d68tlgfgVHb4j7eQeZcTy5hNtY/ej416+Et42zPNB9DjKlBg0kcqq3k1csNB6HpjHzvtpnAPgrYm4oJ+AJEp0/2dbi4l33JStZzALXmTJY15JKdutbhWeCeBpUifQq+hDKCGDL8Nelx9ZyK+49l5qhkE17NHE9a4vb8RJXX7mP3vQgEVTlXa1LJXnHYNksaz46cAa/6ENdie2pY/Hud6zCyYKG7eNd+7Wy0XwmTLbayENeM9ie1v2H/iv4dc9ZWz2nyXIm6LMq66gGXLWW8R+Q10HX7j88SGltW9r0Ix8UWBMnK3f/EZh/l+7neSeSc7FgNr4CLymmb5prEza+1VqxagyzSkeKIvr6nRQSN78vZqr+mjcdlI8LhQxdaONqRrXp19fQssSAyEABpC7aDy0637+4rMUpK+38bjZdobNmlBUWr1mWGxfni9CRXiiSLX+UmVgNWQ+P2/twzwIWWrb3RQkHxdZ0xkq9/8JhP+b7P3A4eaNomoci7njjVgRrF+q2DE411OjIQw/I9fuO2xJIiyq+2MpTi1Hm6kZOGdtPXRSIv833M9yPyPnodvbV29D7ty5L3klkPaOvXjHzSzSt8qIvdj0cvkRNt/jrb0kkWwdiCUtHViY6G1a8T4yWphp5sOyjRF+Uas8SvPtrifa88R3/voIPJfL5xj8eHBWS3KvxIKQqfckB1jjl25x/sXDQbf2ltSklDCYmuPljiTUlmY6s7uxLu7Es7lmYliT9z9uO2I5EaVn3PlLkWo80UDGQwNp66MTL/l6aKtC08ixyzMiDUiOFGlkb+CopY/kOt/XRGIsdyLj8Xu3EqNSfCzXFOyzE/FrlOc9vgR1htu5GyYMRy1hb21ZC8njCl35L9F2X+p3lq+wnx1l/An7m+uOs7f+g4/4e3FfwW09p1GYVmmpyNXlyNkH/m2JtDoSNI0PggGrs/WB46452DxltnaW3IPZx2Nr4bIEkk+Uk00jZQvLLIxLPI5LMxJJ164j433LhNhx7f3zuvF4PMyUsXeisrWu2EhkaF2yLqrhW1UlSNfUH7mZ27jrJnxHEuFo7VjKSeUL3fnv3nVf6XSW17D/HWL8AOuWLpjEuO464a5G3bllOoPhW25cp1mUj4rcuQHv8Aetn85YWsZclxRebHboCDu2FzEkcaTN37/AE9tY1AA9JnYnResLubb9+XFZ7bt+tk8JlICBLWuVJVmgmQkEeSSIGH5jrZXK2Gkhju5aotXd2JhYn9OzdZVW/UIPzALIfKMt3aNkf0YfbyvyZt/fvH1HCb83Tk87iqWQt5VLUUF2w8yJMsWMlQOA2h8XYfn1/8ASOMv+9zP/iev/pHGX/e5n/xPXFHJm4N+8fXsJsPdOMzuVpY+3lXtSwUrCTOkKy4yJC5C6DydR+f2715WzMkMl3E1Gq7RxMzEfqObsqy0KgA+YhpB5SFe6xq7+inrNbm3Bflyue3Ffs5PN5Scgy2bluVpp5nIAHk8jlj+Z6/eLzlmqxiyXK/HG8MdtcOO64XD4fIRvMvft9RbaRSCPSFGB0brcmyN145MttrdmNs4nO42TULNVtxtFKuo7qfFjow7g9x3HW6+KtxB7FWhL9dtHNsPlyeEsu/0VsHxUeRVSkoA0WVJEBPjqZP1gT5XiLfEkFbkHBRfPJXMZKw5Smv+tXDnyUdpY9UPzCNkw+7toZunuPbO4KyXMLnKEqzV7MD+jo6kg/gR6g6g6EffzG7t35untzbO36z3M1nL8qw160Ceru7EAfgB6k6Aak9R/o4nxXEWx5J63H2Cl+SSwZCFmylxf9awEHip7RR6IPmMjPtTirboevVvy/Xbuzaj5cZhKzp9bbJ8WHkFYJECNGleNCR5ag8KwYOODjhtsPs9tvxsyqcRLUNF4DICH1aFiC2vkSfLXXv9jYtDXw3J200nt8c7rkUhY53UGSjaZQSa1kqoYgEowWRQfEq2c2Nvzb9za+7Nt2nqZnCXk8JYZF+IIJV0caMjoSjqQyMykEx4ym7bz4myFky7g44uylY0aQjzs42YhjVn7d9AY3/rQnxdYLHGe84DuMQe9k+PsqUp56n4gGTzps7e6ieQBlgaSLU6eevb7s9jkzecA3GYPexnH2KKXM9c8gTH4U1dfaR/EgSztHFqNPPXt1JjLjtszibH2RLt/jilKWjdoyfCzkpgFNqfv21AjT+hAfJ2wexth7fubo3ZuS0lTDYSinnLNI3xJJCoiDVndyERQWdlUEhcW5r5nk7diQW+Rt1xqSsk6KTHRqswBFasWYKSAXYtIwHkFX7QNwQjbPJOHqPX2hyTSjDWqw1Z0rW49VFqt5sWMbEMurGN0LMTJiuStsSHAzz+1gt/Y1ZLGDyOoLKIbRRfCTQHWKUJINNfHx0Y172PtTUb1SRZalyu7RSxSKdVdHQhlIPcEHqChFyad/YispWPGb0rJmG1OndrzGO82mmgBsafl1Gu4uFtnZW0CvvTY23kKEbAfzeMcz3CNfhqx0/PqRdu8LbOxVolvZmyVvIX41B/l8o4Xpk6fHRhr+XU9CXk07BxFlQsmM2XWTDtqNe63lMl5dddCBY0/LqxeyFqa9etyNLbuWHaWWWRjqzu7ksxJ7kk9R4rjXbEgwME/tZ3f2SWSvg8doAzCa0Ebzk0I0iiDyHXXx8dWBG34RubknMVEr7v5JuxhbVkaq71qkerCrW81DCNSWbRTI7lVI+7nv8A2T+h/wBifSt/c/8Acv036T9LqPL6z6z/AIHt66a+526uZfjH91XH3Cmdssz/AEtHeODyuELsdWP0FnIJKnf0WKyiKPRNNNJpNmfuZ4A5So+WlRcXyLgcbdZPxlhytqrCh/JZ3/j8OpobeU2fK8BYOaW8ttXkPh6+L1cnKrfl4k6/DXqGGplNnxPOVCG7vLbVFB5+nk9rJxKv5+RGnx06gfeX7m/2/wDGFEkfVjJci4LI3FUjU+1Di7NmF2B7aNOg/P8AGnl+Tv3Vcfc152syv9Le3jg8VhA6nVT9BWyDyv39VlsujD1TTXXA/wDrb9D/ALE+lX+2P7a+m/SfpdT4/R/R/wDA9vXXT2+33P/Z'),
							contentType: 'image/jpeg',
							width: 48,
							height: 48,
							// Incorrect `dpi`. The image has a DPI of `72`.
							dpi: 96,
							anchor: {
								row: 2,
								column: 5
							}
						}
					],
					[
						{
							content: dataURLToBlob('data:image/jpeg;base64,/9j/4RBVRXhpZgAATU0AKgAAAAgABwESAAMAAAABAAEAAAEaAAUAAAABAAAAYgEbAAUAAAABAAAAagEoAAMAAAABAAIAAAExAAIAAAAfAAAAcgEyAAIAAAAUAAAAkYdpAAQAAAABAAAAqAAAANQACvyAAAAnEAAK/IAAACcQQWRvYmUgUGhvdG9zaG9wIDIxLjIgKFdpbmRvd3MpADIwMjU6MDI6MjMgMTM6NTE6MjgAAAAAAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAG+gAwAEAAAAAQAAAG8AAAAAAAAABgEDAAMAAAABAAYAAAEaAAUAAAABAAABIgEbAAUAAAABAAABKgEoAAMAAAABAAIAAAIBAAQAAAABAAABMgICAAQAAAABAAAPGwAAAAAAAABIAAAAAQAAAEgAAAAB/9j/7QAMQWRvYmVfQ00AAf/uAA5BZG9iZQBkgAAAAAH/2wCEAAwICAgJCAwJCQwRCwoLERUPDAwPFRgTExUTExgRDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwBDQsLDQ4NEA4OEBQODg4UFA4ODg4UEQwMDAwMEREMDAwMDAwRDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/AABEIAG8AbwMBIgACEQEDEQH/3QAEAAf/xAE/AAABBQEBAQEBAQAAAAAAAAADAAECBAUGBwgJCgsBAAEFAQEBAQEBAAAAAAAAAAEAAgMEBQYHCAkKCxAAAQQBAwIEAgUHBggFAwwzAQACEQMEIRIxBUFRYRMicYEyBhSRobFCIyQVUsFiMzRygtFDByWSU/Dh8WNzNRaisoMmRJNUZEXCo3Q2F9JV4mXys4TD03Xj80YnlKSFtJXE1OT0pbXF1eX1VmZ2hpamtsbW5vY3R1dnd4eXp7fH1+f3EQACAgECBAQDBAUGBwcGBTUBAAIRAyExEgRBUWFxIhMFMoGRFKGxQiPBUtHwMyRi4XKCkkNTFWNzNPElBhaisoMHJjXC0kSTVKMXZEVVNnRl4vKzhMPTdePzRpSkhbSVxNTk9KW1xdXl9VZmdoaWprbG1ub2JzdHV2d3h5ent8f/2gAMAwEAAhEDEQA/APVUkkklKVDrHXek9ExjldUyWY1f5ocZc4/u1VNmy13/ABbVzP16/wAY+H9XA7p+CG5XVyNWHWumfouyI+lY78yj/tz8z1PFOp9V6j1bLdmdSyH5OQ/l7zwP3WNHsrZ/Ir9iSn0jrv8AjrsJdV0HCDW8DJy9Sf6mNU72/wAlz7n/APFLi+ofXv63dRcXZHVL2A/mUO9Bsfu7Mb0t39tZvS+j9U6vkfZumYtmVbpIrbIaD+dY/wChUz+XY5dx0r/Et1zIaH9Ty6cEGD6bAb7B5O2mqn/MusSU+f3ZOTkO3ZFr7neL3Fx/6Saq66l2+l7q3fvMJaf+ivYaP8SXQGt/Wc/Lsd3Nfp1j7n1XqV3+JP6vFv6DOzGO8Xmp4+5tNSSnzXp/14+tvTiPs3VMjaOGWu9ZgHgK8n1WNXZdE/x15THNq67htur4ORi+1483UWO9Oz+zZSgdT/xJ9XoaX9MzqcyNfTtaaXn+S3W+tzv676lw3Vuh9X6LkfZ+qYtmLYfo7x7Xeddrd1dv/W3pKforon1i6N17G+0dLyWXtEb2DSxhPa2l36StaS+XcDqGd03KZl4F78bIrMtsrMH+qf3mO/OY72L2b6h/4zKOvOZ0zq2zG6pxU9uld/8AUn+bv/4L8/8AwX+iSU94kkkkp//Q9VXGf4x/rwPq3gjDwnA9Wy2n0u/pVmWnKc397d7aN3+E/wCK2LqeqdRxul9OyOo5R20YtbrH+JgfRb/Le72MXzb1zrGX1vquR1PMdNuQ8u29mN4rpZ/IqZ7ElNO22y6x9tr3WWWOLnvcSXOcTuc97ne5znOXcfUX/Fnk9eazqXVC7F6Uda2jS27/AIuf5uj/AIX8/wDwX+lUP8WX1Jb9YM53UOoMnpWE4AsPF1v0hR/xbG++/wD63X/hF7k1rWNDGANa0ANaBAAHAASU1emdK6d0nFbh9Nx2Y1DOGMHJ/ee4++x/8uxW0kklKSSSSUpV8/p+D1LGdiZ9DMnHf9KqxocNOHa/Rc399WEklPi317/xXXdHZZ1TogdkdObLr8cndZSOd7f9Njs/7dq/wn59q8/a5zXBzSWuaZBGhBC+qOdCvFf8aP1GZ0XIHWemV7enZT4upaPbTadfbH0aLvzP9FZ+j/0KSnsP8Wf17d1/GPS+pPnquK2W2H/D1DT1P+Pr/wAN/wBu/wCl2d2vl7pnUsvpXUKOo4b9mRjPD63dpHLXfvMe32P/AJC+iMb6zYmV9VnfWShpfSzFsyXVAjcDU1z7qJ/fY+t9aSn/0bP+OrrbqcDD6JU6DluN+QBz6delLXfybLvf/wCg68nwsO/OzKMLGbvvybG1VN8XPOxv5V0/+NPqBzfrnmNBlmI2vHZ/ZaLLP/B7bVa/xQ9MGb9bW5LxLOn0vvEiRvdGPWP/AAZ9n/W0lPsnQuj43ROk43S8Ufo8ZgaXd3OPuttd/KtsLrFfSSSUpeXfXv8Axl/WDon1gyukdPrx200CsttexzrCX1sud/hPS/wn+iXqK88+tv8AisyfrD1/I6vX1BmO3IFY9J1RcRsYyn6Ysb9L00lPA3/4z/rxcST1I1js2uqloHz9Lf8A9JNj/wCM367UWB/7SNg7ssrqc0/+B7v81dN/4x2Z/wCW1f8A2y7/ANKri/rZ9Vc36rdSbgZdjLvUrF1VtcwWkuZ7mu+g/dWkp9c/xf8A+MJv1o9TBzam4/U6Gep7J9O1gIa6ysO91b2Oc3fVv/l/8X2i+e/8Wtr6/rv0ssMbn2NPmHVWtcvoRJSlV6n07F6p0+/p+Yzfj5LDXY3yPDm/y2O97FaSSU/MHVum39K6nldNyP53FsdW4xE7T7bB/Jsb+kYu1+oHXHH6rfWboNrpA6fk5eODOn6J1OS3/pUP2/8AGJf45+ljG+sWP1BjYb1Cgbz42Un0nH/tl2OuM6RnuwMi6wGG3YuTjuHiL6LaG/8ATexySn//0uA+t1jrPrV1h5/7m5AHwFj2t/6IXef4ja2m3rNv5zG4zR8HHIc7/wA9rhfrjU6n62dYY7Sc29w+D7HWN/6Ll3H+I29rcnrGOfp2MosA8mG9rv8Az81JT60kkkkpS5b/ABifWfqH1Y6JTn9PZU+63JbQ4XNc5oa6u62Whj6vfupaupWF9cfqrT9aumV9PtyHYoqvbeLGNDiS1tlW3a4t/wBMkp8nt/xvfXKwHbZj1ebKQf8Az4bFzHWeu9V67l/beq5Bybw0Ma4hrQGglwYxlbWMb7nL0h/+Ixh+h1ojydjT+TJauJ+uX1NzPqnmU4+RczJqyWF9NzAWztO17X1unY5stSU9H/ij+qmbk9Yr+sN7DXgYYeKXO/wtrmmmGN/0dTbHP9T/AEv/AFxezrwT/Ff1/K6X9Z8bEFh+x9ReKL6ifaXO0x7I/wBIy3b/AGF72kpSSSSSnzL/AB4Utd0/pV5HurutYD5Paxzv/PLV5EvWv8eOQBi9Jxu77LrCP6gqZ/6NXkqSn//T53/G3052H9cbr4/R59Vd7fCQPs1g/wA+jf8A20L/ABV9WZ0364Y7bDtrz2OxHE/vP2vp/wA++qqv+2u7/wAcfQnZvQqeq0tm3prz6gH+ht2sef8Ardrav7HqLxiq2ym1l1Tiyytwex40Ic07mub/AFUlP1QksX6ofWKn6x9Cx+osgXEenlVj8y5v843+q7+dr/4KxbSSlLyL62/4zfrP0n6x5/TsR1Ax8azZXvr3Oja13udu8166vOvrP/ikPWur5XVcfqXovynb3Uvp3AGA3S1trf3f9Ekp5A/44PrjH0scefpf+ZLnfrB9Zus/WPIryOq3C11LS2prWtY1oOrtrWAfS/lrr7f8Sf1iB/Q5uG8fyzaz/qabU1X+JP6ymwC7MwmV93Mda8/2WOor/wCrSU819RMS3L+uHSa6hJZksud5NpPr2H/MrX0auY+pv1B6X9VWOtrecvqFrdtmW8bYbz6dNUu9Kv2+73veunSUpJJZn1j65jdA6Nk9UyTpS39Gz9+x3tpqH9d//k0lPkH+N/qrc361fY6zNfTqW1Hw9R/6e0/5tlVf/W1zf1d6cc/Jy9JrxcDMybPIV49vpn/t91KoZeVfmZV2XkO335D3W2vPdzzve7/OK9F+ofQjR9RfrH1y5vvzMLJoxyRr6VdVvrOaf3bb/Z/6DJKf/9T1DJxqMvGtxchgsovY6u1h4c1w2Paf6zSvnP62/VvJ+rXWrunXS6r6eLcf8JUT+jf/AF/zLP8AhF9Irnvrp9UcT609LOO+K82iXYeQfzHkfQfH+At2/pf+3PzElPjX1F+uN/1W6p6rgben5MMzKRzA+hdV/wALTu/ts/R/y17/AIeZi5+LVmYdrb8e9ofVawyCCvmXqXTc3pebbgZ9RoyaDtex3/VN/eY78x62vqf9eeq/VbIIp/WcCwzdhPMNJ/0lTvd6N38v/txJT9DpLC+rn10+r/1jrH2DIDcmJfiWwy5vj+jn9K1v+kp9StbqSlJJJJKUkksb6wfW3oX1dpNnUclrbYlmMz3XP/q1D6P/ABlmypJTqZOTRi0WZOTY2milpfZY8w1rRq5znFeDf4wfrq/6z9RFeMXM6XiEjGYdN7jo7Ksb+8//AAX+ir/4y1Q+uf1/6p9aLPQj7L0xjprxWn6UfRsyX/4V/wD4HX/01zmFhZWflVYeHU6/JvcGVVMEkkpKbv1b6Dl/WHrFHTMXQ2mbbYkV1j+duf8A1P8Az5+jX0Q3ouAzov7DawtwDjnE2A+703M9F3v/AH3MP01jfUP6l0fVbpsWbbepZIDsq4DQfu49R/0Vf/gr/wBJ/U6hJT//1fVUkkklPP8A1t+pnSvrTiCvKHo5dQIx8xgG9n8h/wDpad3+C/zPTXiH1l+p3XPq1eW59O7HJirLr91T/wC3/g3/APB27Hr6PQcz7J9lt+2+n9l2n1vW2+nt7+r6ns2f1klPy4x7mOD2Etc0gtcDBBHBBXTdK/xlfXHpgaxmccqpv+DygLv/AAV/6x/4Muz679Tf8WXUXOt6f1vD6XcZMV5NL6ST/wABZb7f+tW1sXFdQ+pLsYuOJ1rpGcwfR2ZtNbz/AFm5D662/wDbqSno6P8AHd1lrR9o6djWO7mtz2D7nuuT3/47+sOafs/Tcat3Y2Oe8f5rTSuCu6TlUmHvxiR+5lY7x99V701XS8m2Nr8cT+/k0M/8+XMSU9B1T/Gf9cepNcz7YMOp2hZitFf3Xe/Ib/28uWssste6y1xsseZc9xJJPi5zl0OB9S7Mlw+1dY6Tgt/O9TOoe7+y3Gsub/4Iuz6J9Sf8WuCW29T69idTtbrsOTVVTP8AxddzrH/2rtn/AAaSngPq99Vet/WPI9HptBdWDFuS+W01/wDGW/vf8Gz9Kvbfqd9ROlfVajfX+s9RsbF2Y8QY710N/wADT/07P8It3p37O+xVfsv0fsW39B9m2+lt/wCC9H9Ht/qqykpSSSSSn//Z/+0YTlBob3Rvc2hvcCAzLjAAOEJJTQQlAAAAAAAQAAAAAAAAAAAAAAAAAAAAADhCSU0EOgAAAAAA5QAAABAAAAABAAAAAAALcHJpbnRPdXRwdXQAAAAFAAAAAFBzdFNib29sAQAAAABJbnRlZW51bQAAAABJbnRlAAAAAENscm0AAAAPcHJpbnRTaXh0ZWVuQml0Ym9vbAAAAAALcHJpbnRlck5hbWVURVhUAAAAAQAAAAAAD3ByaW50UHJvb2ZTZXR1cE9iamMAAAAMAFAAcgBvAG8AZgAgAFMAZQB0AHUAcAAAAAAACnByb29mU2V0dXAAAAABAAAAAEJsdG5lbnVtAAAADGJ1aWx0aW5Qcm9vZgAAAAlwcm9vZkNNWUsAOEJJTQQ7AAAAAAItAAAAEAAAAAEAAAAAABJwcmludE91dHB1dE9wdGlvbnMAAAAXAAAAAENwdG5ib29sAAAAAABDbGJyYm9vbAAAAAAAUmdzTWJvb2wAAAAAAENybkNib29sAAAAAABDbnRDYm9vbAAAAAAATGJsc2Jvb2wAAAAAAE5ndHZib29sAAAAAABFbWxEYm9vbAAAAAAASW50cmJvb2wAAAAAAEJja2dPYmpjAAAAAQAAAAAAAFJHQkMAAAADAAAAAFJkICBkb3ViQG/gAAAAAAAAAAAAR3JuIGRvdWJAb+AAAAAAAAAAAABCbCAgZG91YkBv4AAAAAAAAAAAAEJyZFRVbnRGI1JsdAAAAAAAAAAAAAAAAEJsZCBVbnRGI1JsdAAAAAAAAAAAAAAAAFJzbHRVbnRGI1B4bEBSAAAAAAAAAAAACnZlY3RvckRhdGFib29sAQAAAABQZ1BzZW51bQAAAABQZ1BzAAAAAFBnUEMAAAAATGVmdFVudEYjUmx0AAAAAAAAAAAAAAAAVG9wIFVudEYjUmx0AAAAAAAAAAAAAAAAU2NsIFVudEYjUHJjQFkAAAAAAAAAAAAQY3JvcFdoZW5QcmludGluZ2Jvb2wAAAAADmNyb3BSZWN0Qm90dG9tbG9uZwAAAAAAAAAMY3JvcFJlY3RMZWZ0bG9uZwAAAAAAAAANY3JvcFJlY3RSaWdodGxvbmcAAAAAAAAAC2Nyb3BSZWN0VG9wbG9uZwAAAAAAOEJJTQPtAAAAAAAQAEgAAAABAAEASAAAAAEAAThCSU0EJgAAAAAADgAAAAAAAAAAAAA/gAAAOEJJTQQNAAAAAAAEAAAAWjhCSU0EGQAAAAAABAAAAB44QklNA/MAAAAAAAkAAAAAAAAAAAEAOEJJTScQAAAAAAAKAAEAAAAAAAAAAThCSU0D9QAAAAAASAAvZmYAAQBsZmYABgAAAAAAAQAvZmYAAQChmZoABgAAAAAAAQAyAAAAAQBaAAAABgAAAAAAAQA1AAAAAQAtAAAABgAAAAAAAThCSU0D+AAAAAAAcAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAA4QklNBAAAAAAAAAIAADhCSU0E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PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMS4yIChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjUtMDItMjNUMTM6NTE6MjgrMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjUtMDItMjNUMTM6NTE6MjgrMDM6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI1LTAyLTIzVDEzOjUxOjI4KzAzOjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY0OTBlNzU1LWYyMTUtNWQ0My1iYjBkLWRjNmI1OWM2NDZmNiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjQ1NTY0N2UwLTI4MmYtNjc0OS05MzY3LTk0NTIyZmU0YTI2OCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmEyMGU3NTczLTg1YmMtOTE0Ny1iZDkzLTJiMjU0NWE5NjFiYSIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmEyMGU3NTczLTg1YmMtOTE0Ny1iZDkzLTJiMjU0NWE5NjFiYSIgc3RFdnQ6d2hlbj0iMjAyNS0wMi0yM1QxMzo1MToyOCswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2NDkwZTc1NS1mMjE1LTVkNDMtYmIwZC1kYzZiNTljNjQ2ZjYiIHN0RXZ0OndoZW49IjIwMjUtMDItMjNUMTM6NTE6MjgrMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4yIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/Pv/iDFhJQ0NfUFJPRklMRQABAQAADEhMaW5vAhAAAG1udHJSR0IgWFlaIAfOAAIACQAGADEAAGFjc3BNU0ZUAAAAAElFQyBzUkdCAAAAAAAAAAAAAAABAAD21gABAAAAANMtSFAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEWNwcnQAAAFQAAAAM2Rlc2MAAAGEAAAAbHd0cHQAAAHwAAAAFGJrcHQAAAIEAAAAFHJYWVoAAAIYAAAAFGdYWVoAAAIsAAAAFGJYWVoAAAJAAAAAFGRtbmQAAAJUAAAAcGRtZGQAAALEAAAAiHZ1ZWQAAANMAAAAhnZpZXcAAAPUAAAAJGx1bWkAAAP4AAAAFG1lYXMAAAQMAAAAJHRlY2gAAAQwAAAADHJUUkMAAAQ8AAAIDGdUUkMAAAQ8AAAIDGJUUkMAAAQ8AAAIDHRleHQAAAAAQ29weXJpZ2h0IChjKSAxOTk4IEhld2xldHQtUGFja2FyZCBDb21wYW55AABkZXNj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'),
							contentType: 'image/jpeg',
							width: 48,
							height: 48,
							// The image has a DPI of `72`.
							dpi: 72,
							anchor: {
								row: 1,
								column: 1
							},
							// Has non-zero offset.
							offsetX: 20,
							offsetY: 20
						}
					]
				]
			}
		]
	}
}

function dataURLToBlob(dataURL) {
	// Split the data URL string into the MIME type part and the data part
	const parts = dataURL.split(',')
	const mimeType = parts[0].match(/:(.*?);/)[1] // Extract the MIME type (e.g., 'image/png')
	const base64Data = parts[1]

	// Decode the base64 string into a binary string
	const byteString = atob(base64Data)

	// Convert the binary string to a Uint8Array (a typed array of 8-bit unsigned integers)
	const arrayBuffer = new ArrayBuffer(byteString.length)
	const intArray = new Uint8Array(arrayBuffer)
	for (let i = 0; i < byteString.length; i++) {
		intArray[i] = byteString.charCodeAt(i)
	}

	// Create a new Blob object using the Uint8Array and the MIME type
	return new Blob([intArray], { type: mimeType })
}