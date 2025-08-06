import escapeXmlCharacters from './escapeXmlCharacters.js';
import removeInvalidXmlCharacters from './removeInvalidXmlCharacters.js';
export default function sanitizeText(string) {
  return escapeXmlCharacters(removeInvalidXmlCharacters(string), {
    attribute: false
  });
}
//# sourceMappingURL=sanitizeText.js.map