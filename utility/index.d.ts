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
export function findElements(xml: string, tagName: string): FoundElement[];
export function findElementInsideElement(xml: string, tagName: string, enclosingElement: FoundElement): FoundElement | undefined;
export function findElementsInsideElement(xml: string, tagName: string, enclosingElement: FoundElement): FoundElement[];
export function getOpeningTagMarkup(tagName: string, attributes?: Attributes): string;
export function getClosingTagMarkup(tagName: string): string;
export function getSelfClosingTagMarkup(tagName: string, attributes?: Attributes): string;
export function replaceElement(xml: string, element: FoundElement, markup: string): string;
export function getMarkupInsideElement(xml: string, element: FoundElement): string;
export function setMarkupInsideElement(xml: string, element: FoundElement, markup: string): string;
export function prependMarkupInsideElement(xml: string, element: FoundElement, markup: string): string;
export function appendMarkupInsideElement(xml: string, element: FoundElement, markup: string): string;
export function escapeAttributeName(attributeName: string): string;
export function escapeAttributeValue(attributeValue: string): string;
export function escapeTextContent(textContent: string): string;