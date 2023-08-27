function getGeneratedWeeks(_generatedWeeks: number = 1) {
  let generatedWeeks = _generatedWeeks

  if (generatedWeeks === 1) generatedWeeks = 4
  else generatedWeeks = _generatedWeeks + 4
  return generatedWeeks
}

export default getGeneratedWeeks
