import { CommonStyleProperties } from '../common.d.js'

interface ConditionalFormattingConditionWithFormula {
	formula: string;
}

type ConditionalFormattingStringOperator =
	'=' |
	'!='

type ConditionalFormattingNumericOperatorOnOneValue =
	'<' |
	'<=' |
	'>' |
	'>=' |
	'=' |
	'!='

type ConditionalFormattingNumericOperatorOnTwoValues =
	'...'

interface ConditionalFormattingConditionWithOperatorAndOneStringValue {
	operator: ConditionalFormattingStringOperator;
	value: string;
}

interface ConditionalFormattingConditionWithOperatorAndOneNumericValue {
	operator: ConditionalFormattingNumericOperatorOnOneValue;
	value: number;
}

interface ConditionalFormattingConditionWithOperatorAndTwoNumericValues {
	operator: ConditionalFormattingNumericOperatorOnTwoValues;
	value: number;
	value2: number;
}

export type ConditionalFormattingCondition =
	ConditionalFormattingConditionWithFormula |
	ConditionalFormattingConditionWithOperatorAndOneStringValue |
	ConditionalFormattingConditionWithOperatorAndOneNumericValue |
	ConditionalFormattingConditionWithOperatorAndTwoNumericValues

// It seems that the "conditional formatting" feature in the XLSX specification
// doesn't support setting custom `fontFamily` or `fontSize` for some weird reason.
// https://github.com/catamphetamine/write-excel-file/pull/10#issuecomment-3960778016
interface ConditionalFormattingStyle extends Exclude<CommonStyleProperties, 'fontFamily' | 'fontSize'> {}

export interface ConditionalFormatting {
	cellRange: {
		from: {
			row: number,
			column: number
		},
		to: {
			row: number,
			column: number
		}
	};

	condition: ConditionalFormattingCondition;

	style: ConditionalFormattingStyle;
}

export interface ConditionalFormattingParametersSingleSheet {
	conditionalFormatting?: ConditionalFormatting[];
}

export interface ConditionalFormattingParametersMultipleSheets {
	conditionalFormatting?: ConditionalFormatting[][];
}