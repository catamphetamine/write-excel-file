export default function Email() {}
var regexp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export function isEmail(value) {
  return regexp.test(value);
}
//# sourceMappingURL=Email.js.map