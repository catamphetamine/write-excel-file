import generateCell from './cell.js'
import getCellStyleProperties from './helpers/getCellStyleProperties.js'
import getOpeningTagMarkup from '../../../xml/getOpeningTagMarkup.js'
import getClosingTagMarkup from '../../../xml/getClosingTagMarkup.js'
import isCellObject from '../../helpers/isCellObject.js'

// import Integer from '../types/Integer.js'

export default function generateRow(row, rowIndex, {
	findOrCreateCellStyle,
	findOrCreateSharedString,
	customFont,
	dateFormat,
	features,
	usesSchema
}) {
	// To ensure the row number starts as in Excel.
	const rowNumber = rowIndex + 1
	let rowHeight
	const rowCells = row
		.map((cell, columnIndex) => {
			if (cell === undefined || cell === null) {
				return ''
			}

			const cellObject = isCellObject(cell) ? cell : { value: cell }

			const cellStyleProperties = getCellStyleProperties(cellObject, features)

			const {
				height
			} = cellObject

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
					if (!usesSchema) {
						type = detectValueType(value)
					}
					if (type === undefined) {
						// The default cell value type is `String`.
						type = String
						value = String(value)
					}
				}
			}

			// Validate `format` property.
			if (format) {
				if (type !== Date && type !== Number && type !== String && type !== 'Formula') { // && type !== Integer) {
					throw new Error('`format` can only be used on `Date`, `Number`, `String` or `"Formula"` cells') // or `Integer` cells')
				}
				if (type === String && format !== '@') {
					throw new Error('`String` cells only support "@" `format`')
				}
			} else {
				if (type === Date) {
					format = dateFormat
				}
			}

			let cellStyleId
			if (
				format ||
				customFont ||
				cellStyleProperties
			) {
				cellStyleId = findOrCreateCellStyle({
					format,
					...cellStyleProperties
				})
			}

			if (height) {
				if (rowHeight === undefined || rowHeight < height) {
					rowHeight = height
				}
			}

			return generateCell(
				rowNumber,
				columnIndex,
				value,
				type,
				cellStyleId,
				findOrCreateSharedString
			)
		})
		.join('')

	const rowAttributes = {
		r: rowNumber
	}

	if (rowHeight) {
		rowAttributes.ht = rowHeight
		rowAttributes.customHeight = 1
	}

	return getOpeningTagMarkup('row', rowAttributes) + rowCells + getClosingTagMarkup('row')
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