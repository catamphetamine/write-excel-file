import ORDER_OF_SIBLINGS from './orderOfSiblings.js'

/**
 * Returns the order of siblings in a given `.xml` file inside given parent tag(s).
 * @param {string} fileName
 * @param {string[]} parentTagNames
 * @returns {string[]}
 */
export default function getOrderOfSiblings(fileName, ...parentTagNames) {
	let orderOfSiblings = ORDER_OF_SIBLINGS[fileName]
	if (!orderOfSiblings) {
		// File not supported.
		// Return nothing.
		return
	}

	if (parentTagNames.length === 0) {
		throw new Error('At least one parent element tag name is required')
	}

	for (const tagName of parentTagNames) {
		const orderOfSiblingsMatchingElement = orderOfSiblings.find((element) => {
			if (Array.isArray(element)) {
				return element[0] === tagName
			} else {
				return element === tagName
			}
		})

		if (!orderOfSiblingsMatchingElement) {
			// The element is not present in the pre-defined order of elements.
			// Return nothing.
			return
		}

		if (Array.isArray(orderOfSiblingsMatchingElement)) {
			orderOfSiblings = orderOfSiblingsMatchingElement[1]
		} else {
			// The element doesn't specify any child elements.
			// Return nothing.
			return
		}
	}

	if (orderOfSiblings) {
		// Convert element of `OrderOfSiblings` array to a `string`.
		return orderOfSiblings.map((element) => {
			if (Array.isArray(element)) {
				return element[0]
			} else {
				return element
			}
		})
	}
}