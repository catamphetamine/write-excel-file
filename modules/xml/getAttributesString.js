import sanitizeValue from './sanitizeAttributeValue.js';
export default function getAttributesString(attributes) {
  return Object.keys(attributes).map(function (name) {
    return "".concat(name, "=\"").concat(sanitizeValue(String(attributes[name])), "\"");
  }).reduce(function (combined, part) {
    return combined + ' ' + part;
  }, '');
}
//# sourceMappingURL=getAttributesString.js.map