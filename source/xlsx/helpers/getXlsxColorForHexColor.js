export default function getXlsxColorForHexColor(color) {
  if (color[0] !== '#') {
    throw new Error(`Color "${color}" must start with a "#"`)
  }
  return `FF${color.slice('#'.length).toUpperCase()}`
}
