const isValidJSON = (str: string) => {
  try {
    const parsed = JSON.parse(str)
    return typeof parsed === 'object' && parsed !== null
  } catch (e) {
    return false
  }
}

export default isValidJSON
