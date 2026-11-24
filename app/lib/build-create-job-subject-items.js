const createJobSubjects = require('../data/create-job-subjects')

module.exports = function buildCreateJobSubjectItems (data = {}) {
  const createJob = data.createJob || {}
  let selected = createJob.subjects || data.subjects || []
  if (!Array.isArray(selected)) {
    selected = selected ? [selected] : []
  }
  return createJobSubjects().map(({ value, text, hint }, index) => ({
    id: index + 1,
    value,
    text,
    ...(hint ? { hint: { text: hint } } : {}),
    checked:
      selected.includes(value) ||
      (value === 'Economics and Business Studies' && selected.includes('Economics'))
  }))
}