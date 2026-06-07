import generateCell from './cell.js'
import getCellStyleProperties from './helpers/getCellStyleProperties.js'
import isCellObject from '../../helpers/isCellObject.js'

export default function generateRow(tag, row, index, parameters) {
	// Calculate row height.
	let rowHeight
	for (const cell of row) {
		if (isCellObject(cell)) {
			if (cell.height) {
				if (rowHeight === undefined || rowHeight < cell.height) {
					rowHeight = cell.height
				}
			}
		}
	}

	// Generate `<r/>` element inner XML.
	const rowIndex = index
	const rowCellsXml = row
		.map((cell, index) => {
			return getCellXml(tag, cell, index, rowIndex, parameters)
		})
		.join('')

	const rowAttributes = {
		r: index + 1
	}

	if (rowHeight) {
		rowAttributes.ht = rowHeight
		rowAttributes.customHeight = 1
	}

	return tag('row', rowAttributes, rowCellsXml, index)
}

function getCellXml(tag, cell, index, rowIndex, {
	findOrCreateCellStyle,
	findOrCreateSharedString,
	hasDefaultFont,
	dateFormat,
	features
}) {
	if (cell === undefined || cell === null) {
		return ''
	}

	const cellObject = isCellObject(cell) ? cell : { value: cell }

	const cellStyleProperties = getCellStyleProperties(cellObject, features)

	let {
		type,
		value,
		format
	} = cellObject

	if (isEmpty(value)) {
		value = null
	} else {
		// Get cell value type.
		if (type === undefined) {
			type = detectValueType(value)
			if (type === undefined) {
				// The default cell value type is `String`.
				type = String
				value = String(value)
			}
		}
	}

	// Validate `format` property.
	if (format) {
		if (type !== Date && type !== Number && type !== String && type !== 'Formula') {
			throw new Error(`\`format\` "${format}" was specified on a cell of type \`${type}\`. \`format\` could only be specified on a cell of type \`Date\`, \`Number\`, \`String\` or \`"Formula"\`.`)
		}
		if (type === String && format !== '@') {
			throw new Error(`\`format\` "${format}" was specified on a cell of type \`String\`. The only supported \`format\` for a cell of type \`String\` is "@".`)
		}
	} else {
		if (type === Date) {
			format = dateFormat
		}
	}

	const hasFormat = Boolean(format)
	const hasCellStyle = Boolean(cellStyleProperties)

	let cellStyleId
	if (
		hasDefaultFont ||
		hasFormat ||
		hasCellStyle
	) {
		cellStyleId = findOrCreateCellStyle({
			format,
			...cellStyleProperties
		})
	}

	return generateCell(tag, {
		value,
		type,
		cellStyleId,
		findOrCreateSharedString
	}, index, rowIndex)
}

function isEmpty(value) {
  return value === undefined || value === null || value === ''
}

function detectValueType(value) {
  switch (typeof value) {
    case 'string':
      return String
    case 'number':
      return Number
    case 'boolean':
      return Boolean
    default:
      if (value instanceof Date) {
        return Date
      }
  }
}