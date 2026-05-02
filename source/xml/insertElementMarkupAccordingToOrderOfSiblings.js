import findElement from './findElement.js'
import { getOpeningTagRegExpPattern } from './findElementsNonRecursive_.js'
import appendMarkupInsideElement from './appendMarkupInsideElement.js'
import getChildElements from './getChildElements.js'
import prependMarkupInsideElement from './prependMarkupInsideElement.js'

export default function insertElementMarkupAccordingToOrderOfSiblings(
	xml,
	elementMarkup,
	orderOfSiblings,
	...parentElementTagNames
) {
	if (parentElementTagNames.length === 0) {
		throw new Error('At least one parent element tag name is required')
	}

	// Reorder the parent elements from top to bottom.
	parentElementTagNames = parentElementTagNames.slice().reverse()

	// Find the immediate parent element.
	let parentElement
	for (const parentElementTagName of parentElementTagNames) {
		if (parentElement) {
			// Doesn't use `findElementInsideElement()` here in order to only search
			// in the immediate children of the `parentElement`.
			// parentElement = findElementInsideElement(xml, parentElementTagName, parentElement)
			parentElement = getChildElements(xml, parentElement).find(
				_ => _.tagName === parentElementTagName
			)
		} else {
			parentElement = findElement(xml, parentElementTagName)
		}
		if (!parentElement) {
			throw new Error(`Element not found: <${parentElementTagName}>`)
		}
	}

	// Get element's tag name.
	const elementTagNameMatch = elementMarkup.match(TAG_NAME_REG_EXP)
	if (!elementTagNameMatch) {
		throw new Error(`Couldn't extract tag name from markup: ${elementMarkup}`)
	}
	const elementTagName = elementTagNameMatch[1]

	// See if the `.xlsx` specification enforces a specific order of elements in such case.
	if (!orderOfSiblings || orderOfSiblings.length < 2) {
		return appendMarkupInsideElement(xml, parentElement, elementMarkup)
	}

	const children = getChildElements(xml, parentElement)
	if (children.length === 0) {
		return appendMarkupInsideElement(xml, parentElement, elementMarkup)
	}

	const elementTagNameOrder = orderOfSiblings.indexOf(elementTagName)
	if (elementTagNameOrder < 0) {
		// The element tag name is unknown.
		return appendMarkupInsideElement(xml, parentElement, elementMarkup)
	}

	const tagNamesBeforeElement = orderOfSiblings.slice(0, elementTagNameOrder).reverse()
	for (const tagName of tagNamesBeforeElement) {
		const precedingElement = children.find(_ => _.tagName === tagName)
		if (precedingElement) {
			return xml.slice(0, precedingElement.selfClosingTag
				? precedingElement.openingTagEndIndex + 1
				: precedingElement.closingTagEndIndex + 1
			) + elementMarkup + xml.slice(precedingElement.selfClosingTag
				? precedingElement.openingTagEndIndex + 1
				: precedingElement.closingTagEndIndex + 1
			)
		}
	}

	return prependMarkupInsideElement(xml, parentElement, elementMarkup)
}

const TAG_NAME_REG_EXP = new RegExp(getOpeningTagRegExpPattern())

// function findOrderOfElementsInsideParentElement(orderOfElements, parentElementTagName) {
// 	for (const element of orderOfElements) {
// 		if (Array.isArray(element)) {
// 			if (element[0] === parentElementTagName) {
// 				return element[1]
// 			}
// 			const recursionResult = findOrderOfElementsInsideParentElement(element[1], parentElementTagName)
// 			if (recursionResult) {
// 				return recursionResult
// 			}
// 		} else {
// 			// No order of child elements is specified for the `element`
// 			// so there's nothing to search for inside this `element`.
// 			// And if the `element` happens to be `parentElementTagName`,
// 			// there's no need to look any further at all
// 			// because it seems that no order of child elements is specified
// 			// for the `parentElementTagName`.
// 			if (element === parentElementTagName) {
// 				return
// 			}
// 		}
// 	}
// }