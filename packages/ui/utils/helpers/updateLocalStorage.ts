const updateLocalStorage = (key: string, value: Object) => {
  const currentData = localStorage.getItem(key)
  const cacheData = currentData ? JSON.parse(currentData) : {}

  localStorage.setItem(
    key,
    JSON.stringify({
      ...cacheData,
      ...value,
    }),
  )
}

export default updateLocalStorage
