const isTodayBeforeEndsAt = (endsAt?: string | null | undefined) => {
  const todayDate = new Date()
  const endsAtDate = new Date(endsAt ?? '')

  // Returns true if today is before endsAt
  return todayDate < endsAtDate
}

export default isTodayBeforeEndsAt
