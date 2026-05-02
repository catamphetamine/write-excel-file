export type Attributes = Record<string, string | number | boolean>;

export interface FoundElement {
	tagName: string;
	// openingTagMarkup: string;
	openingTagStartIndex: number;
	openingTagEndIndex: number;
	openingTagAttributes: Attributes;
	selfClosingTag: boolean;
	// closingTagMarkup?: string;
	closingTagStartIndex?: number;
	closingTagEndIndex?: number;
}

export function findElement(xml: string, tagName: string): FoundElement | undefined;
export function findElementInsideElement(xml: string, tagName: string, enclosingElement: FoundElement): FoundElement | undefined;
export function getChildElements(xml: string, enclosingElement: FoundElement): FoundElement[];
export function getOpeningTagMarkup(tagName: string, attributes?: Attributes): string;
export function getClosingTagMarkup(tagName: string): string;
export function getSelfClosingTagMarkup(tagName: string, attributes?: Attributes): string;
export function insertElementMarkupAccordingToOrderOfSiblings(xml: string, elementMarkup: string, orderOfElements: string[], ...parentElementTagNames: string[]): string;
export function replaceElement(xml: string, element: FoundElement, markup: string): string;
export function getMarkupInsideElement(xml: string, element: FoundElement): string;
export function setMarkupInsideElement(xml: string, element: FoundElement, markup: string): string;
export function prependMarkupInsideElement(xml: string, element: FoundElement, markup: string): string;
export function appendMarkupInsideElement(xml: string, element: FoundElement, markup: string): string;
export function sanitizeAttributeName(attributeName: string): string;
export function sanitizeAttributeValue(attributeValue: string): string;
export function sanitizeTextContent(textContent: string): string;

type OrderOfSiblingsFileName =
	| 'xl/workbook.xml'
	| 'xl/styles.xml'
	| 'xl/worksheets/sheet{id}.xml'

export function getOrderOfSiblings(fileName: OrderOfSiblingsFileName, ...parentElementTagNames: string[]): string[] | undefined;