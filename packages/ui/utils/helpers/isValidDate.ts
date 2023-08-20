function isValidDate(dateString: string = ''): boolean {
  const regEx = /^\d{4}-\d{2}-\d{2}$/ // Matches the format 'YYYY-MM-DD'
  if (!dateString.match(regEx)) return false // Invalid format

  const d = new Date(dateString)
  const dNum = d.getTime()

  if (!dNum && dNum !== 0) return false // NaN value, Invalid date

  // Check for valid day of month given the month and year
  return d.toISOString().slice(0, 10) === dateString
}

export default isValidDate
