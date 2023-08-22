const birthdayToAge = (birthday: Date) => {
  const today = new Date()

  let years = today.getFullYear() - birthday.getFullYear()
  let months = today.getMonth() - birthday.getMonth()

  // If the birthday hasn't occurred this year yet, subtract a year from the age
  if (
    today.getMonth() < birthday.getMonth() ||
    (today.getMonth() === birthday.getMonth() &&
      today.getDate() < birthday.getDate())
  ) {
    years--
    months += 12
  }

  months -= birthday.getMonth()
  if (today.getDate() < birthday.getDate()) {
    months--
  }

  if (years === 0) {
    return `${months} months old`
  } else if (months === 0) {
    return `${years} years old`
  } else {
    return `${years} years and ${months} months old`
  }
}

export default birthdayToAge
