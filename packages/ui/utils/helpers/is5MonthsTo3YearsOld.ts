const is5MonthsTo3YearsOld = (_date: Date | string) => {
  const date = new Date(_date).getTime()
  const today = new Date()
  const fiveMonthsAgo = new Date().setMonth(today.getMonth() - 5)
  const threeYearsAgo = new Date().setFullYear(today.getFullYear() - 3)

  return date >= fiveMonthsAgo && date <= threeYearsAgo
}

export default is5MonthsTo3YearsOld
