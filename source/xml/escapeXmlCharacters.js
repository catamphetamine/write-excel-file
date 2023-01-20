/**
 * Escapes text for XML: replaces ">" with "&gt;", etc.
 * https://en.wikipedia.org/wiki/Character_encodings_in_HTML#HTML_character_references
 * @param  {string} string
 * @param  {boolean} [options.attribute]
 * @return {string}
 */
export default function escapeXmlCharacters(string, { attribute }) {
	// By default, "&", "<" and ">" characters should be escaped:
	//
	// The ampersand character (&) and the left angle bracket (<) must not appear
	// in their literal form, except when used as markup delimiters, or within a comment,
	// a processing instruction, or a CDATA section. If they are needed elsewhere,
	// they must be escaped using either numeric character references or the strings
	// " & " and " < " respectively. The right angle bracket (>) may be represented
	// using the string " > ", and must, for compatibility, be escaped using either
	// " > " or a character reference when it appears in the string " ]]> " in content,
	// when that string is not marking the end of a CDATA section.
	//
	string = string
		.replace(AMPERSAND_REGEXP, '&amp;')
		.replace(GREATER_THAN_REGEXP, '&gt;')
		.replace(LESS_THAN_REGEXP, '&lt;')

	// Additionally, in attribute values, single and double quotes might be required
	// to be escaped depending on what character is used for delimiting those attribute values.
	if (attribute) {
		string = string
			.replace(SINGLE_QUOTE_REGEXP, '&apos;')
			.replace(DOUBLE_QUOTE_REGEXP, '&quot;')
	}

	return string
}

const AMPERSAND_REGEXP = /&/g
const GREATER_THAN_REGEXP = />/g
const LESS_THAN_REGEXP = /</g
const SINGLE_QUOTE_REGEXP = /'/g
const DOUBLE_QUOTE_REGEXP = /"/g