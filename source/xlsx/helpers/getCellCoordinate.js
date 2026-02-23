export default function getCellCoordinate(rowIndex, columnIndex) {
  return `${getColumnLetter(columnIndex)}${rowIndex + 1}`
}

// `26` letters in the alphabet: from "A" to "Z".
const LETTERS_COUNT = 26

function getColumnLetter(columnIndex) {
  if (typeof columnIndex !== 'number') {
    return ''
  }
  const prefix = Math.floor(columnIndex / LETTERS_COUNT)
  // Letter character codes start at `97`.
  const letter = String.fromCharCode(97 + (columnIndex % LETTERS_COUNT)).toUpperCase()
  if (prefix === 0) {
    return letter
  }
  return getColumnLetter(prefix - 1) + letter
}