/**
 * UX and content recommendations for the create job listing journey.
 * Pairs with app/data/job-listing-flow.js (HS1–HS22).
 */

const flowGuide = require('./job-listing-flow')()

const standards = [
  {
    ref: 'Service Standard point 1',
    text: 'Understand users and their needs — publishers are often busy school office staff, not HR specialists.'
  },
  {
    ref: 'Service Standard point 13',
    text: 'Make the user experience simple — fewer decisions per screen, clear defaults from organisation profile.'
  },
  {
    ref: 'Content design principle',
    text: 'Use plain English, front-load the question, put guidance in hints not long intros.'
  },
  {
    ref: 'GOV.UK Design System',
    text: 'Use established patterns (task list, check answers, one thing per page) rather than inventing layout.'
  }
]

const journeyImprovements = [
  {
    title: 'Replace the long start screen with a task list',
    detail: 'HS2 lists everything the user will need in three bullet groups on a full-width page. Users cannot see progress or skip ahead.',
    recommendation: 'Use the GOV.UK task list pattern: four sections (Job details, Pay and contract, About the role, Applications and publish) with links into grouped steps. Keep the start page to one short paragraph and one primary button.',
    rationale: 'Task lists show progress, match mental models from other DfE services, and meet Service Standard 13. Publishers return to incomplete listings often.',
    patterns: ['Task list', 'Start pages (when to use)']
  },
  {
    title: 'Fix section progress labelling',
    detail: 'Captions say “section 1 of 4” but branch routes (faith forms, college paths, optional key stage) break the count.',
    recommendation: 'Show task list section name only (no false totals), or derive “Step X of Y” from the user’s actual path server-side.',
    rationale: 'Inaccurate progress erodes trust (GOV.UK content principle: do not mislead).',
    patterns: ['Task list', 'Caption']
  },
  {
    title: 'Make “Save and finish later” real',
    detail: 'Secondary buttons appear on many steps but draft save is not wired consistently.',
    recommendation: 'One draft record per listing, autosave on continue, confirmation banner on return. Align copy with Manage jobs → Draft jobs.',
    rationale: 'Service Standard point 7 (work in the open) and point 13 — users must be able to pause without losing work.',
    patterns: ['Button — secondary', 'Notification banner']
  },
  {
    title: 'Use explicit back links',
    detail: 'Many screens use javascript:history.back(), which breaks when users land from documentation deep links.',
    recommendation: 'Store previous step URL in the session or build a step registry; use govukBackLink with a real href per step.',
    rationale: 'Predictable navigation is an accessibility and usability baseline (WCAG 2.2 — predictable).',
    patterns: ['Back link']
  },
  {
    title: 'Pre-fill from organisation and school profile',
    detail: 'Location, phase, safeguarding text and contact details are re-entered or shown as static copy inconsistently.',
    recommendation: 'Default location, phase and contact email from org profile; show summary list with “Change” only when needed.',
    rationale: 'Reduces error and time (Service Standard point 13). Matches how check answers already works at the end.',
    patterns: ['Summary list', 'Inset text']
  }
]

const stepImprovements = [
  {
    id: 'HS1',
    name: 'Job listing area',
    prototypePath: '/jobs',
    current: 'Active jobs list with save-as-template and sub-nav.',
    recommendation: 'Primary call to action “Create a job listing” at top of page (MOJ page header actions pattern, already on welcome in some variants). Surface drafts and scheduled counts.',
    rationale: 'Publishers need a clear entry point; GDS service navigation pattern favours one obvious primary task.',
    patterns: ['Service navigation', 'Page header actions']
  },
  {
    id: 'HS2',
    name: 'Create a job listing (start)',
    prototypePath: '/jobs/new/start',
    current: 'Full-width grid with three headings and long bullet lists before continue.',
    recommendation: 'Narrow to two-thirds column; one H1, two sentences, task list beneath. Move “what you need” into task list intro or collapsible details.',
    rationale: 'Start pages should not duplicate the whole journey (GOV.UK “question pages” guidance). Reduces scroll on mobile.',
    patterns: ['Task list', 'Details']
  },
  {
    id: 'HS3',
    name: 'Location',
    prototypePath: '/jobs/new/locations',
    current: 'Separate screen for multi-site trusts; single-school users skip.',
    recommendation: 'Only show for multi-school accounts. Default single selection; use checkboxes with hints (address) — keep, but gate with routing not a manual step for most users.',
    rationale: 'Conditional steps should be invisible when not applicable (Service Standard 13).',
    patterns: ['Checkboxes', 'Conditional reveal']
  },
  {
    id: 'HS4',
    name: 'Job title',
    prototypePath: '/jobs/new/title',
    current: 'Title then posts to role flow.',
    recommendation: 'Single text input with hint (“Include subject or level if helpful”). Validate length; show listing number preview later only on check page.',
    rationale: 'One thing per page — title only; avoid asking role-type questions on the same screen.',
    patterns: ['Text input', 'Label + hint']
  },
  {
    id: 'HS5',
    name: 'Job role',
    prototypePath: '/jobs/new/role_all',
    current: 'Large checkbox list of role types (design debt on map).',
    recommendation: 'Replace with autocomplete or filterable radios grouped Teaching / Leadership / Support. Infer phase and subject prompts from role choice.',
    rationale: 'Long checkbox lists are hard on mobile and screen readers; radios or autocomplete match GDS form guidance.',
    patterns: ['Radios', 'Select — autocomplete']
  },
  {
    id: 'HS6',
    name: 'Education phase',
    prototypePath: '/jobs/new/phase',
    current: 'Separate phase screen after role.',
    recommendation: 'Merge with HS5/HS7: ask phase only when role does not imply it (e.g. “Teaching assistant” → prompt key stage). Default from organisation.phase.',
    rationale: 'Fewer screens; defaults from profile data.',
    patterns: ['Radios', 'Summary list (on check)']
  },
  {
    id: 'HS7',
    name: 'Key stage',
    prototypePath: '/jobs/new/key-stage',
    current: 'Optional; branches to subjects or contract.',
    recommendation: 'Use checkboxes only for teaching roles; skip for non-teaching. Clear legend: “Which key stages will the post cover?”',
    rationale: 'Conditional journey — don’t show irrelevant questions (plain English + minimal burden).',
    patterns: ['Checkboxes', 'Conditional routing']
  },
  {
    id: 'HS8',
    name: 'Subjects',
    prototypePath: '/jobs/new/subjects',
    current: 'Subject checkboxes; college path differs.',
    recommendation: 'Autocomplete multi-select with “popular subjects” shortcuts; optional for non-teaching roles.',
    rationale: 'Matches jobseeker search facets; reduces list fatigue.',
    patterns: ['Select', 'Checkboxes']
  },
  {
    id: 'HS9',
    name: 'Contract information',
    prototypePath: '/jobs/new/contract',
    current: 'Contract type on one page; working pattern sometimes separate; flow can skip to salary.',
    recommendation: 'One “Contract and working pattern” page: contract type, FTE/part-time hours, working pattern checkboxes. Reveal fixed-term length inline.',
    rationale: 'Users think of these together; splitting causes inconsistent data (content debt).',
    patterns: ['Radios', 'Conditional reveal', 'Checkboxes']
  },
  {
    id: 'HS10',
    name: 'Job start date',
    prototypePath: '/jobs/new/start-date',
    current: 'Often absent from happy path; still on map.',
    recommendation: 'Include in HS9 or pay section as date input with “As soon as possible” radio. Required for search filters.',
    rationale: 'Jobseekers filter by start date; collecting late forces check-page edits.',
    patterns: ['Date input', 'Radios']
  },
  {
    id: 'HS11',
    name: 'Salary and allowances',
    prototypePath: '/jobs/new/salary',
    current: 'Multiple salary types; FE hides allowances; complex copy.',
    recommendation: 'Ask “How do you want to show pay?” once; show one relevant field set. Use reveal for TLR/allowances. Link to help content in details, not above the fold.',
    rationale: 'Progressive disclosure (GDS) — content debt flag on map; simplify for primary users first.',
    patterns: ['Radios', 'Details', 'Warning text (if needed)']
  },
  {
    id: 'HS12',
    name: 'About the role',
    prototypePath: '/jobs/new/about',
    current: 'Long page: ECT, skills, school offer, safeguarding flags and text areas.',
    recommendation: 'Split: (1) Skills and experience, (2) School offer + safeguarding (pre-fill safeguarding from org profile). Character count on textareas.',
    rationale: 'Long pages overwhelm; pre-filled safeguarding matches organisation profile work already in prototype.',
    patterns: ['Textarea', 'Character count', 'Inset text']
  },
  {
    id: 'HS13',
    name: 'Offer school visits?',
    prototypePath: '/jobs/new/school-visits',
    current: 'Yes/no then email branch.',
    recommendation: 'Combine with contact details (HS20): visits yes/no, then conditional email field on same page.',
    rationale: 'Reduces yes/no screen fatigue; related employer contact topics belong together.',
    patterns: ['Radios', 'Conditional reveal']
  },
  {
    id: 'HS14',
    name: 'Visa sponsorship',
    prototypePath: '/jobs/new/sponsorship2',
    current: 'Separate screen after visits.',
    recommendation: 'Single “Immigration and sponsorship” yes/no with link to gov.uk skilled worker guidance. Place before or within About the role for international recruitment roles.',
    rationale: 'Legal clarity early helps publishers decide; short factual question fits one thing per page if kept separate.',
    patterns: ['Radios', 'Inset text']
  },
  {
    id: 'HS15',
    name: 'Publish and closing dates',
    prototypePath: '/jobs/new/listing-dates',
    current: 'Publish + close date/time on one form.',
    recommendation: 'Keep combined. Add inset: default close 4 weeks after publish. Validate closing after publish.',
    rationale: 'Good example of grouping related fields; add smart defaults (Service Standard 13).',
    patterns: ['Date input', 'Radios', 'Inset text']
  },
  {
    id: 'HS16',
    name: 'Application method',
    prototypePath: '/jobs/new/application_method',
    current: 'Long KCSIE explanation then two radios; faith variants on other templates.',
    recommendation: 'Lead with the question; move KCSIE explanation to details component and hint. One branch for standard / faith / other — not separate prototype files.',
    rationale: 'Content design: question first, evidence second. KCSIE option stays prominent via label and tag.',
    patterns: ['Radios', 'Details', 'Tag']
  },
  {
    id: 'HS17',
    name: 'Anonymise applications',
    prototypePath: '/jobs/new/anonymised',
    current: 'Separate screen for TV form users.',
    recommendation: 'Show only if HS16 = TV form; use radios with short hint about equal opportunities monitoring. Otherwise skip.',
    rationale: 'Conditional logic reduces steps for minority paths.',
    patterns: ['Radios', 'Conditional routing']
  },
  {
    id: 'HS18',
    name: 'Upload documents (yes/no)',
    prototypePath: '/jobs/new/upload',
    current: 'Yes/no then file upload chain.',
    recommendation: 'Merge HS18–19: optional file upload component on one page with “Add another document”. Skip question if none needed — default No.',
    rationale: 'MOJ multi-file upload pattern can sit on one screen; avoids extra continue click.',
    patterns: ['File upload', 'Summary list']
  },
  {
    id: 'HS19',
    name: 'Upload documents',
    prototypePath: '/jobs/new/file',
    current: 'PDF/DOCX upload and file-check loop.',
    recommendation: 'See HS18; enforce file type and size errors inline per GDS error message pattern.',
    rationale: 'Accessible errors tied to inputs (WCAG 3.3.1).',
    patterns: ['Error message', 'File upload']
  },
  {
    id: 'HS20',
    name: 'Contact details',
    prototypePath: '/jobs/new/contact-details',
    current: 'Email + optional phone after application branch.',
    recommendation: 'Pre-select organisation email; optional phone behind “Yes” reveal. De-duplicate emails collected on offline application path.',
    rationale: 'Don’t ask twice (Service Standard 13); summary list on check page already exposes duplicates.',
    patterns: ['Radios', 'Input', 'Summary list']
  },
  {
    id: 'HS21',
    name: 'Check and publish',
    prototypePath: '/jobs/new/check',
    current: 'Very long summary list with change links; correct pattern but heavy.',
    recommendation: 'Group summary cards by task list section with H2s. Sticky “Publish” on mobile. Confirm publish date in warning text if scheduling.',
    rationale: 'Check answers pattern is correct GOV.UK; grouping aids scanning before legal publish action.',
    patterns: ['Summary list', 'Summary card', 'Warning text', 'Button']
  },
  {
    id: 'HS22',
    name: 'Confirmation',
    prototypePath: '/jobs/new/confirmation',
    current: 'Panel + next steps + feedback survey.',
    recommendation: 'Keep panel. Limit next steps to 3 links. Move satisfaction survey to email or optional secondary page.',
    rationale: 'Confirmation pages should be short; user task is complete (Service Standard point 12 — work towards KPIs without blocking exit).',
    patterns: ['Panel', 'Inset text']
  }
]

function enrichSteps (steps) {
  const pathById = Object.fromEntries(flowGuide.steps.map(s => [s.id, s]))
  return steps.map(step => {
    const flow = pathById[step.id]
    return Object.assign({}, step, {
      openHref: flow && flow.openHref,
      flowNote: flow && flow.note
    })
  })
}

module.exports = function buildJobListingFlowImprovements () {
  return {
    pageTitle: 'Job listing flow — improvements',
    lead: 'UX, UI and content recommendations to simplify the create listing journey. Each step links to the current prototype screen and cites GOV.UK patterns and the Government service standard.',
    flowDocHref: '/documentation/job-listing-flow',
    flowDocTitle: 'Job listing flow (publication)',
    standards,
    journeyImprovements,
    stepImprovements: enrichSteps(stepImprovements),
    proposedOutcome: 'A simplified happy path could remove roughly 5–8 screens for a typical primary school teaching role by combining related questions, pre-filling profile data, and branching only when organisation type or application method requires it.'
  }
}