const isValidJSON = (str: string | Object) => {
  try {
    const parsed = JSON.parse(JSON.stringify(str))
    return typeof parsed === 'object' && parsed !== null
  } catch (e) {
    return false
  }
}

export default isValidJSON
