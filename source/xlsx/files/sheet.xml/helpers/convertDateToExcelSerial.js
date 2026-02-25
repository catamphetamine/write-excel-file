// "Excel serial date" is just
// the count of days since `01/01/1900`
// (seems that it may be even fractional).
//
// The count of days elapsed
// since `01/01/1900` (Excel epoch)
// till `01/01/1970` (Unix epoch).
// Accounts for leap years
// (19 of them, yielding 19 extra days).
const daysBeforeUnixEpoch = 70 * 365 + 19

// An hour, approximately, because a minute
// may be longer than 60 seconds, see "leap seconds".
const hour = 60 * 60 * 1000

const day = 24 * hour

export default function convertDateToExcelSerial(date) {
  return date.getTime() / day + daysBeforeUnixEpoch
}