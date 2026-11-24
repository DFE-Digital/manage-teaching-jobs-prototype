/**
 * HS7 / HS8 — route key stage and subjects only for teaching-path roles.
 */

const TEACHING_PATH_ROLES = new Set([
  'Teacher or lecturer',
  'Teaching assistant',
  'HLTA (higher level teaching assistant)',
  'Learning support or cover supervisor'
])

const PHASES_WITH_KEY_STAGE_STEP = new Set([
  'Middle school',
  'Secondary school',
  'Through school',
  'Sixth form or college'
])

const POPULAR_SUBJECTS = [
  'Mathematics',
  'English',
  'Science',
  'Physical education',
  'History',
  'Geography',
  'Art and design',
  'Computing'
]

function jobRolesFromSession (data = {}) {
  const role = data.jobRole
  if (!role) return []
  return Array.isArray(role) ? role : [role]
}

function normalisePhase (phase) {
  if (phase == null || phase === '') return ''
  if (Array.isArray(phase)) return String(phase[0] || '')
  return String(phase)
}

function phaseUsesCollegeSubjectList (phase, orgName = '') {
  if (orgName === 'Hope college') return true
  const label = normalisePhase(phase)
  const lower = label.toLowerCase()
  return lower.includes('college') || label === 'Sixth form or college'
}

function requiresTeachingKeyStageFlow (data = {}) {
  return jobRolesFromSession(data).some(role => TEACHING_PATH_ROLES.has(role))
}

function shouldAskKeyStage (phase) {
  const label = normalisePhase(phase)
  if (!label) return false
  return PHASES_WITH_KEY_STAGE_STEP.has(label)
}

function nextStepAfterPhase (data = {}) {
  if (!requiresTeachingKeyStageFlow(data)) {
    return 'section-summary'
  }
  const phase = data.createJob && data.createJob.phase
  if (shouldAskKeyStage(phase)) {
    return 'key-stage'
  }
  return 'subjects'
}

module.exports = {
  TEACHING_PATH_ROLES,
  POPULAR_SUBJECTS,
  jobRolesFromSession,
  normalisePhase,
  phaseUsesCollegeSubjectList,
  requiresTeachingKeyStageFlow,
  shouldAskKeyStage,
  nextStepAfterPhase
}