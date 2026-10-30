/**
 * FE parity #3436 — /documentation/fe-additional-allowances-3436
 * Screenshots: app/assets/images/documentation/fe-additional-allowances-3436/*.png
 * Capture: PORT=3100 npm start, then npm run capture:fe-additional-allowances-docs
 */

module.exports = {
  guideTitle: 'Remove additional allowances for colleges',
  guideDescription:
    'Ticket #3436 (FE parity): college hiring staff cannot offer school-style additional allowances, so those questions are hidden when creating or editing a job listing for a further education or college organisation.',
  imageDir: 'fe-additional-allowances-3436',
  collegeUserQuery: '?userEmailAddress=bob@hopecollege.sch.uk',
  schoolUserQuery: '?userEmailAddress=rachael@courtland.sch.uk',
  userNeed:
    'As FE college hiring staff, I do not offer additional allowances like schools do, so I should not be asked about them when I publish a college vacancy.',
  successCriteria:
    'College and further education create/edit journeys hide additional allowances on the salary step and on check your answers. School hiring staff still see the allowances questions.',
  implemented: [
    'app/lib/fe-parity.js — isCollegeFeCreateJob() (Hope college, College org type, FE phase strings, Sixth form or Further education job role type).',
    'Nunjucks filter isCollegeFeCreateJob on jobs/new/salary.njk and jobs/edit/salary.njk — heading becomes “Salary” and allowance radios are omitted.',
    'jobs/new/check.njk and jobs/edit/check.njk — summary rows for allowances hidden for college/FE.',
    'Jobseeker prototype (teaching-vacancies-prototype v1.3) hides allowances on FE listings and Quick Apply — see linked documentation below.'
  ],
  jobseekerDocUrl: 'http://localhost:3000/1-3/documentation/fe-additional-allowances-3436',
  screenshots: [
    {
      id: 'college-salary',
      title: 'College — salary step',
      file: 'college-salary-no-allowances.png',
      caption:
        'Signed in as Hope college (bob@hopecollege.sch.uk) — salary page title is “Salary” with no additional allowances question.',
      prototypePath: '/jobs/new/salary?userEmailAddress=bob@hopecollege.sch.uk'
    },
    {
      id: 'school-salary',
      title: 'School — salary step (comparison)',
      file: 'school-salary-with-allowances.png',
      caption:
        'Signed in as a school user — “Salary and allowances” with the additional allowances radios still shown.',
      prototypePath: '/jobs/new/salary?userEmailAddress=rachael@courtland.sch.uk'
    },
    {
      id: 'college-check',
      title: 'College — check your answers',
      file: 'college-check-no-allowances.png',
      caption:
        'Check details summary for a college listing — no rows for additional allowances.',
      prototypePath: '/jobs/new/check?userEmailAddress=bob@hopecollege.sch.uk'
    }
  ]
}
