function isEmpty (value) {
  if (value === undefined || value === null || value === '') {
    return true
  }
  if (Array.isArray(value) && value.length === 0) {
    return true
  }
  return false
}

function withDefault (value, fallback) {
  return isEmpty(value) ? fallback : value
}

const CREATE_JOB_DEFAULTS = {
  contract: 'Permanent',
  'full-time-salary': 'Between £30,000 and £40,000',
  'actual-salary': '£32,000',
  'pay-scale': 'M1 to M6',
  'key-stages': ['Key stage 3', 'Key stage 4'],
  publishDate: 'Tomorrow (7 June 2022)',
  process: 'By email',
  method: 'No',
  'school-visits': 'Yes',
  'createJob-sponsorship': 'No',
  anonymised: 'With names',
  suitability: 'Yes',
  skills:
    'Experience teaching the subject at GCSE or A level. Ability to contribute to the wider life of the school or college.',
  benefits:
    'Staff wellbeing programme, on-site parking, continued professional development.',
  'other-information': 'No',
  upload: 'No',
  'provide-phone-number': 'Yes',
  'phone-number': '020 7345 6374',
  allowances: 'TLR2 (£2,873)'
}

/**
 * Fill gaps on create-job check your answers so the summary list is demo-ready
 * when session data is incomplete (direct links, skipped steps, cleared fields).
 */
function buildCreateJobCheckDisplay (sessionData = {}) {
  const fromSession = sessionData.createJob || {}
  const createJob = { ...CREATE_JOB_DEFAULTS, ...fromSession }

  for (const [key, fallback] of Object.entries(CREATE_JOB_DEFAULTS)) {
    createJob[key] = withDefault(createJob[key], fallback)
  }

  return {
    ...sessionData,
    jobRole: withDefault(sessionData.jobRole, 'Teacher or lecturer'),
    'job-title': withDefault(sessionData['job-title'], 'Teacher of mathematics'),
    subjects: withDefault(sessionData.subjects, [
      'Agriculture / horticulture / land-based studies'
    ]),
    'working-patterns': withDefault(sessionData['working-patterns'], 'Full time'),
    signIn: withDefault(sessionData.signIn, 'No'),
    'additional-allowances': withDefault(sessionData['additional-allowances'], 'No'),
    'religion-question': withDefault(
      sessionData['religion-question'],
      'Do not ask for religious information'
    ),
    'createJob-sponsorship': withDefault(sessionData['createJob-sponsorship'], 'No'),
    createJob
  }
}

module.exports = buildCreateJobCheckDisplay
