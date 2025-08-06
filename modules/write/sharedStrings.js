import $text from '../xml/sanitizeText.js';
export default function initSharedStrings() {
  var sharedStrings = [];
  var sharedStringsIndex = {};
  return {
    getSharedStrings: function getSharedStrings() {
      return sharedStrings;
    },
    getSharedString: function getSharedString(string) {
      var id = sharedStringsIndex[string];
      if (id === undefined) {
        id = String(sharedStrings.length);
        sharedStringsIndex[string] = id;
        sharedStrings.push(string);
      }
      return id;
    }
  };
}
//# sourceMappingURL=sharedStrings.js.map