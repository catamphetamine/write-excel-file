// Copy-pasted from:
// https://github.com/davidramos-om/zipcelx-on-steroids/blob/master/src/util/Truncate.js

export default function floatToInteger(x) {
  // The `Math.trunc()` function returns the integer part of a number
  // by removing any fractional digits.
  //
  // `Math.trunc()` is not supported by IE11
  // https://stackoverflow.com/questions/44576098
  //
  if (Math.trunc) {
    return Math.trunc(x)
  }
  if (isNaN(x)) {
    return NaN
  }
  if (x > 0) {
    return Math.floor(x)
  }
  return Math.ceil(x)
}