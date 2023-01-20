// Copy-pasted from:
// https://gist.github.com/john-doherty/b9195065884cdbfd2017a4756e6409cc

const INVALID_CHARACTERS = /((?:[\0-\x08\x0B\f\x0E-\x1F\uFFFD\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/g
const DISCOURAGED_CHARACTERS = new RegExp('([\\x7F-\\x84]|[\\x86-\\x9F]|[\\uFDD0-\\uFDEF]|(?:\\uD83F[\\uDFFE\\uDFFF])|(?:\\uD87F[\\uDFFE\\uDFFF])|(?:\\uD8BF[\\uDFFE\\uDFFF])|(?:\\uD8FF[\\uDFFE\\uDFFF])|(?:\\uD93F[\\uDFFE\\uDFFF])|(?:\\uD97F[\\uDFFE\\uDFFF])|(?:\\uD9BF[\\uDFFE\\uDFFF])|(?:\\uD9FF[\\uDFFE\\uDFFF])|(?:\\uDA3F[\\uDFFE\\uDFFF])|(?:\\uDA7F[\\uDFFE\\uDFFF])|(?:\\uDABF[\\uDFFE\\uDFFF])|(?:\\uDAFF[\\uDFFE\\uDFFF])|(?:\\uDB3F[\\uDFFE\\uDFFF])|(?:\\uDB7F[\\uDFFE\\uDFFF])|(?:\\uDBBF[\\uDFFE\\uDFFF])|(?:\\uDBFF[\\uDFFE\\uDFFF])(?:[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uD7FF\\uE000-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF](?![\\uDC00-\\uDFFF])|(?:[^\\uD800-\\uDBFF]|^)[\\uDC00-\\uDFFF]))', 'g')

/**
 * Removes invalid XML characters from a string
 * @param {string} string - a string containing potentially invalid XML characters (non-UTF8 characters, STX, EOX etc)
 * @param {boolean} removeDiscouragedCharacters - whether it should also remove discouraged but valid XML characters
 * @return {string} a sanitized string stripped of invalid (and by default also discouraged) XML characters
 */
export default function removeInvalidXmlCharacters(string, { removeDiscouragedCharacters = true } = {}) {
	// Remove everything forbidden by XML 1.0 specification, plus the unicode replacement character U+FFFD.
	string = string.replace(INVALID_CHARACTERS, '')

	if (removeDiscouragedCharacters) {
		// Remove everything discouraged by XML 1.0 specification.
		string = string.replace(DISCOURAGED_CHARACTERS, '')
	}

	return string
}