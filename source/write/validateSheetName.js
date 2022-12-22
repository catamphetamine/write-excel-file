// https://stackoverflow.com/questions/451452/valid-characters-for-excel-sheet-names
// Sheet name can't be empty.
// Sheet name shouldn't exceed 31 characters.
// Sheet name shouldn't contain any of the following characters: []/\:*?

const ILLEGAL_CHARACTERS_IN_SHEET_NAME = /[\[\]\/\\:*?]+/

export default function validateSheetName(sheetName) {
  if (!sheetName) {
  	throw new Error('Sheet name can\'t be empty')
  }
  if (sheetName.length > 31) {
  	throw new Error(`Sheet name "${sheetName}" can\'t be longer than 31 characters`)
  }
  if (ILLEGAL_CHARACTERS_IN_SHEET_NAME.test(sheetName)) {
  	throw new Error(`Sheet name "${sheetName}" contains illegal characters: []/\\:*?`)
  }
}