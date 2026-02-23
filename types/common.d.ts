export type FontWeight = 'bold';

export type FontStyle = 'italic';

export type Color = string;

export type FillPatternStyle =
	'darkDown' |
	'darkGray' |
	'darkGrid' |
	'darkHorizontal' |
	'darkTrellis' |
	'darkUp' |
	'darkVertical' |
	'gray0625' | // Grayscale of 0.0625 (1/16)
	'gray125' | // Grayscale of 0.125 (1/8)
	'lightDown' |
	'lightGray' |
	'lightGrid' |
	'lightHorizontal' |
	'lightTrellis' |
	'lightUp' |
	'lightVertical' |
	'mediumGray';

type BorderStyle =
	'hair' |
	'dotted' |
	'dashDotDot' |
	'dashDot' |
	'dashed' |
	'thin' |
	'mediumDashDotDot' |
	'slantDashDot' |
	'mediumDashDot' |
	'mediumDashed' |
	'medium' |
	'double' |
	'thick';

interface TextDecorationProperties {
	strikethrough?: boolean;
}

interface TextDecorationPropertiesWithSingleUnderline extends TextDecorationProperties {
	underline: true;
}

interface TextDecorationPropertiesWithDoubleUnderline extends TextDecorationProperties {
	doubleUnderline: true;
}

type TextDecoration =
	TextDecorationProperties |
	TextDecorationPropertiesWithSingleUnderline |
	TextDecorationPropertiesWithDoubleUnderline

export interface CommonStyleProperties {
	fontFamily?: string;
	fontSize?: number;
	fontWeight?: FontWeight;
	fontStyle?: FontStyle;
	textDecoration?: TextDecoration;
	textColor?: Color;
	backgroundColor?: Color;
	fillPatternStyle?: FillPatternStyle;
	fillPatternColor?: Color;
	borderColor?: Color;
	borderStyle?: BorderStyle;
	leftBorderColor?: Color;
	leftBorderStyle?: BorderStyle;
	rightBorderColor?: Color;
	rightBorderStyle?: BorderStyle;
	topBorderColor?: Color;
	topBorderStyle?: BorderStyle;
	bottomBorderColor?: Color;
	bottomBorderStyle?: BorderStyle;
}