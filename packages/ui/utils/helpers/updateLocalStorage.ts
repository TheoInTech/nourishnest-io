const updateLocalStorage = (key: string, value: Object) => {
  const currentData = localStorage.getItem(key)
  const onboardingCacheData = currentData ? JSON.parse(currentData) : {}

  localStorage.setItem(
    key,
    JSON.stringify({
      ...onboardingCacheData,
      ...value,
    }),
  )
}

export default updateLocalStorage
