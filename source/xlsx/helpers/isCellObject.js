import isObject from './isObject.js'

/**
 * Tells if a cell in sheet data is a simple value like `1` or "abc"
 * or if it's a fully-specified object like `{ value: "abc", type: String, ... }`.
 * https://gitlab.com/catamphetamine/write-excel-file/-/issues/107
 * @returns {boolean}
 */
export default function isCellObject(cell) { // (cell: Cell): value is CellObject {
  return isObject(cell)
}
