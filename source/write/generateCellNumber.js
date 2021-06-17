// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/commons/generatorCellNumber.js

export default function generateCellNumber(columnIndex, rowNumber) {
  return `${generateColumnLetter(columnIndex)}${rowNumber}`
}

// `26` letters in the alphabet: from "A" to "Z".
const LETTERS_COUNT = 26

function generateColumnLetter(columnIndex) {
  if (typeof columnIndex !== 'number') {
    return ''
  }
  const prefix = Math.floor(columnIndex / LETTERS_COUNT)
  // Letter character codes start at `97`.
  const letter = String.fromCharCode(97 + (columnIndex % LETTERS_COUNT)).toUpperCase()
  if (prefix === 0) {
    return letter
  }
  return generateColumnLetter(prefix - 1) + letter
}