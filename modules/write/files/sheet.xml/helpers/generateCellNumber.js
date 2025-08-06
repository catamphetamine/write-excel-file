// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/commons/generatorCellNumber.js

export default function generateCellNumber(columnIndex, rowNumber) {
  return "".concat(generateColumnLetter(columnIndex)).concat(rowNumber);
}

// `26` letters in the alphabet: from "A" to "Z".
var LETTERS_COUNT = 26;
function generateColumnLetter(columnIndex) {
  if (typeof columnIndex !== 'number') {
    return '';
  }
  var prefix = Math.floor(columnIndex / LETTERS_COUNT);
  // Letter character codes start at `97`.
  var letter = String.fromCharCode(97 + columnIndex % LETTERS_COUNT).toUpperCase();
  if (prefix === 0) {
    return letter;
  }
  return generateColumnLetter(prefix - 1) + letter;
}
//# sourceMappingURL=generateCellNumber.js.map