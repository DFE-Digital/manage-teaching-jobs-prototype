/**
 * Create listing task list — section completion and status tags.
 */

const SECTION_TASKS = {
  'job-details': ['job-location', 'job-title', 'job-role-phase-subjects'],
  'pay-and-contract': ['contract-working-pattern', 'salary', 'job-start-date'],
  'about-the-role': ['about-the-role', 'school-visits', 'visa-sponsorship'],
  'applications-and-publish': [
    'listing-dates',
    'application-method',
    'contact-details'
  ],
  'check-and-publish': ['check-and-publish']
}

const PREREQUISITE_SECTIONS_FOR_CHECK = [
  'job-details',
  'pay-and-contract',
  'about-the-role',
  'applications-and-publish'
]

const SECTION_SAVED_MESSAGE = {
  'job-details': 'Job details section is saved.',
  'pay-and-contract': 'Pay and contract section is saved.',
  'about-the-role': 'About the role section is saved.',
  'applications-and-publish': 'Applications and publish section is saved.'
}

const TAG = {
  'not-started': { text: 'Not started', tagClass: 'govuk-tag--grey' },
  'in-progress': { text: 'In progress', tagClass: 'govuk-tag--blue' },
  'cannot-start-yet': { text: 'Cannot start yet', tagClass: 'govuk-tag--grey' },
  completed: { text: 'Completed', tagClass: 'govuk-tag--green' }
}

function ensureProgress (data) {
  if (!data) return
  if (!data.createJobTaskProgress) data.createJobTaskProgress = {}
}

function tasksForSection (sectionKey, user) {
  const ids = (SECTION_TASKS[sectionKey] || []).slice()
  const multiSite = user && user.organisation && user.organisation.schools &&
    user.organisation.schools.length > 1
  if (sectionKey === 'job-details' && !multiSite) {
    return ids.filter(id => id !== 'job-location')
  }
  return ids
}

function markCompleted (data, taskIds) {
  ensureProgress(data)
  taskIds.forEach(id => {
    data.createJobTaskProgress[id] = 'completed'
  })
}

function markInProgress (data, taskId) {
  ensureProgress(data)
  if (data.createJobTaskProgress[taskId] !== 'completed') {
    data.createJobTaskProgress[taskId] = 'in-progress'
  }
}

function completeSection (req, sectionKey, options = {}) {
  const exclude = options.excludeTaskIds || []
  const ids = tasksForSection(sectionKey, req.session.user)
    .filter(id => !exclude.includes(id))
  markCompleted(req.session.data, ids)
}

function hasTaskData (taskId, data) {
  const cj = data.createJob || {}
  switch (taskId) {
    case 'job-location':
      return Boolean(cj.locations && cj.locations.length)
    case 'job-title':
      return Boolean(data['job-title'])
    case 'job-role-phase-subjects':
      return Boolean(data.jobRole || data.roleType || cj.phase || data.subjects)
    case 'contract-working-pattern':
      return Boolean(cj.contract || data['working-patterns'])
    case 'salary':
      return Boolean(cj['salary-details'] || cj['full-time-salary'] || cj['actual-salary'])
    case 'job-start-date':
      return Boolean(cj['start-date'])
    case 'about-the-role':
      return Boolean(cj.skills || cj.suitability || cj.benefits)
    case 'school-visits':
      return Boolean(cj['school-visits'])
    case 'visa-sponsorship':
      return Boolean(cj['createJob-sponsorship'] || data['createJob-sponsorship'] || cj.sponsorship)
    case 'listing-dates':
      return Boolean(cj.publishDate || cj['closing-date'])
    case 'application-method':
      return Boolean(data.signIn || data.how || cj.method)
    case 'contact-details':
      return Boolean(cj['contact-details--another'] || cj['school-visits-email-address'])
    case 'check-and-publish':
      return Boolean(data.createJobListingPublished)
    default:
      return false
  }
}

function allTaskIds (user) {
  return [
    ...tasksForSection('job-details', user),
    ...tasksForSection('pay-and-contract', user),
    ...tasksForSection('about-the-role', user),
    ...tasksForSection('applications-and-publish', user),
    ...tasksForSection('check-and-publish', user)
  ]
}

function isTaskCompleted (data, taskId, user) {
  return resolveStatus(taskId, data, user) === 'completed'
}

function canStartCheckAndPublish (data, user) {
  return PREREQUISITE_SECTIONS_FOR_CHECK.every(sectionKey =>
    tasksForSection(sectionKey, user).every(taskId =>
      isTaskCompleted(data, taskId, user)
    )
  )
}

function resolveStatus (taskId, data, user) {
  ensureProgress(data)
  const stored = data.createJobTaskProgress[taskId]
  if (stored === 'completed') return 'completed'
  if (taskId === 'check-and-publish' && user && !canStartCheckAndPublish(data, user)) {
    return 'cannot-start-yet'
  }
  if (stored === 'in-progress') return 'in-progress'
  if (hasTaskData(taskId, data)) return 'in-progress'
  return 'not-started'
}

function getTaskStatuses (data, user) {
  const statuses = {}
  allTaskIds(user).forEach(taskId => {
    const key = resolveStatus(taskId, data, user)
    statuses[taskId] = TAG[key]
  })
  return statuses
}

function markPublished (req) {
  ensureProgress(req.session.data)
  req.session.data.createJobListingPublished = true
  markCompleted(req.session.data, ['check-and-publish'])
}

function sectionSavedMessage (sectionKey) {
  return SECTION_SAVED_MESSAGE[sectionKey] || 'Section is saved.'
}

function sectionForTask (taskId) {
  return Object.keys(SECTION_TASKS).find(section =>
    SECTION_TASKS[section].includes(taskId)
  )
}

function markSectionInProgressFromTask (data, taskId, user) {
  if (!taskId) return
  const section = sectionForTask(taskId)
  if (!section) {
    markInProgress(data, taskId)
    return
  }
  tasksForSection(section, user).forEach(id => {
    if (data.createJobTaskProgress && data.createJobTaskProgress[id] === 'completed') {
      return
    }
    markInProgress(data, id)
  })
}

const PROGRESS_SAVED_MESSAGE =
  'Progress saved. Continue from the task list when you are ready.'

module.exports = {
  completeSection,
  markInProgress,
  markCompleted,
  getTaskStatuses,
  markPublished,
  tasksForSection,
  sectionSavedMessage,
  sectionForTask,
  markSectionInProgressFromTask,
  canStartCheckAndPublish,
  PROGRESS_SAVED_MESSAGE
}