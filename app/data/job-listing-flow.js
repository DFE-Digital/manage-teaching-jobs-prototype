/**
 * Hiring staff publication journey (Map 1) — prototype routes from /jobs/new/start.
 * Reference: Teaching Vacancies publication and applications mapping (HS1–HS22).
 */

const EXAMPLE_USER_QUERY = '?userEmailAddress=rachael@courtland.sch.uk'

function withUser (path) {
  return path + EXAMPLE_USER_QUERY
}

const stepsRaw = [
  { id: 'HS1', name: 'Job listing area', route: 'GET /jobs', type: 'all', path: '/jobs' },
  { id: 'HS2', name: 'Create a job listing', route: 'GET /jobs/new/start', type: 'start', path: '/jobs/new/start' },
  {
    id: 'HS3',
    name: 'Location',
    route: 'GET /jobs/new/locations',
    type: 'all',
    optional: true,
    note: 'Multi-school organisations',
    path: '/jobs/new/locations'
  },
  { id: 'HS4', name: 'Job title', route: 'GET /jobs/new/title', type: 'all', path: '/jobs/new/title' },
  { id: 'HS5', name: 'Job role', route: 'GET /jobs/new/role_all', type: 'design-debt', path: '/jobs/new/role_all' },
  { id: 'HS6', name: 'Education phase', route: 'GET /jobs/new/phase', type: 'all', path: '/jobs/new/phase' },
  {
    id: 'HS7',
    name: 'Key stage',
    route: 'GET /jobs/new/key-stage',
    type: 'all',
    optional: true,
    note: 'Some role paths',
    path: '/jobs/new/key-stage'
  },
  { id: 'HS8', name: 'Subjects', route: 'GET /jobs/new/subjects', type: 'all', path: '/jobs/new/subjects' },
  {
    id: 'HS9',
    name: 'Contract information',
    route: 'GET /jobs/new/contract',
    type: 'all',
    note: 'Includes working pattern on same screen',
    path: '/jobs/new/contract',
    extraLinks: [{ path: '/jobs/new/working-patterns', label: 'Working patterns (standalone)' }]
  },
  {
    id: 'HS10',
    name: 'Job start date',
    route: 'GET /jobs/new/start-date',
    type: 'all',
    optional: true,
    note: 'Captured on check page when not shown',
    path: '/jobs/new/start-date'
  },
  {
    id: 'HS11',
    name: 'Salary and allowances',
    route: 'GET /jobs/new/salary',
    type: 'content-debt',
    path: '/jobs/new/salary'
  },
  { id: 'HS12', name: 'About the role', route: 'GET /jobs/new/about', type: 'all', path: '/jobs/new/about' },
  { id: 'HS13', name: 'Offer school visits?', route: 'GET /jobs/new/school-visits', type: 'all', path: '/jobs/new/school-visits' },
  {
    id: 'HS14',
    name: 'Can you offer visa sponsorship?',
    route: 'GET /jobs/new/sponsorship2',
    type: 'all',
    path: '/jobs/new/sponsorship2'
  },
  { id: 'HS15', name: 'Closing date', route: 'GET /jobs/new/listing-dates', type: 'all', note: 'Publish and closing dates', path: '/jobs/new/listing-dates' },
  {
    id: 'HS16',
    name: 'Application method',
    route: 'GET /jobs/new/application_method',
    type: 'kcsie',
    note: 'KCSIE / other method choice',
    path: '/jobs/new/application_method',
    extraLinks: [
      { path: '/jobs/new/method', label: 'Application form (alternate)' },
      { path: '/jobs/new/method_faith', label: 'Faith school form' },
      { path: '/jobs/new/method_catholic', label: 'Catholic school form' }
    ]
  },
  { id: 'HS17', name: 'Anonymise application?', route: 'GET /jobs/new/anonymised', type: 'all', path: '/jobs/new/anonymised' },
  { id: 'HS18', name: 'Do you want to upload documents?', route: 'GET /jobs/new/upload', type: 'all', path: '/jobs/new/upload' },
  {
    id: 'HS19',
    name: 'Upload documents',
    route: 'GET /jobs/new/file',
    type: 'all',
    optional: true,
    path: '/jobs/new/file',
    extraLinks: [{ path: '/jobs/new/file-check', label: 'Another file?' }]
  },
  { id: 'HS20', name: 'Hiring staff contact details', route: 'GET /jobs/new/contact-details', type: 'all', path: '/jobs/new/contact-details' },
  { id: 'HS21', name: 'Check details and publish', route: 'GET /jobs/new/check', type: 'end', path: '/jobs/new/check' },
  { id: 'HS22', name: 'Job listing published', route: 'GET /jobs/new/confirmation', type: 'all', path: '/jobs/new/confirmation' }
]

function resolveOpenHref (step) {
  if (!step.path) {
    return null
  }
  return withUser(step.path)
}

module.exports = function buildJobListingFlowGuide () {
  const steps = stepsRaw.map(step => {
    const openHref = resolveOpenHref(step)
    const extraLinks = (step.extraLinks || []).map(link => ({
      label: link.label,
      href: withUser(link.path)
    }))
    return Object.assign({}, step, { openHref, extraLinks })
  })

  return {
    pageTitle: 'Job listing flow (publication)',
    lead: 'Step-by-step map from the job listing area to a published listing.',
    entryHref: withUser('/jobs/new/start'),
    entryExample: '/jobs/new/start' + EXAMPLE_USER_QUERY,
    userQuery: EXAMPLE_USER_QUERY,
    steps
  }
}
