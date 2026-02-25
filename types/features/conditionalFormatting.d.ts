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

interface ConditionalFormattingStyle extends CommonStyleProperties {}

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