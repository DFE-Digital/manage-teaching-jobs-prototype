function asArray (value) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function phaseValues (data) {
  const createJob = data && data.createJob
  if (!createJob) return []
  return asArray(createJob.phase).map(p => String(p).toLowerCase())
}

function isCollegeFeCreateJob (data, user) {
  if (data && data.roleType === 'Sixth form or Further education job') {
    return true
  }

  const org = user && user.organisation
  if (org) {
    const orgType = String(org.type || '').toLowerCase()
    if (orgType === 'college') return true
    const orgName = String(org.name || '').toLowerCase()
    if (orgName.includes('college') && !orgName.includes('school and college')) {
      return true
    }
    const orgPhase = String(org.phase || '').toLowerCase()
    if (
      orgPhase.includes('sixth form or college') ||
      orgPhase.includes('further education')
    ) {
      return true
    }
  }

  return phaseValues(data).some(phase =>
    phase.includes('further education') ||
    phase.includes('sixth form or college') ||
    phase === 'college'
  )
}

module.exports = {
  isCollegeFeCreateJob
}
