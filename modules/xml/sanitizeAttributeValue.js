import escapeXmlCharacters from './escapeXmlCharacters.js';
import removeInvalidXmlCharacters from './removeInvalidXmlCharacters.js';
export default function sanitizeAttributeValue(string) {
  return escapeXmlCharacters(removeInvalidXmlCharacters(string), {
    attribute: true
  });
}
//# sourceMappingURL=sanitizeAttributeValue.js.map