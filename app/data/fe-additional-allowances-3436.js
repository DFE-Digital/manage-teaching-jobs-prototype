/**
 * FE parity #3436 — /documentation/fe-additional-allowances-3436
 * Screenshots: app/assets/images/documentation/fe-additional-allowances-3436/*.png
 * Capture: PORT=3100 npm start, then npm run capture:fe-additional-allowances-docs
 */

module.exports = {
  guideTitle: 'Remove the additional allowances section from the application process',
  guideDescription:
    'Ticket #3436 (FE parity): FE colleges cannot offer school-style additional allowances, so those fields are removed from college hiring-staff and jobseeker journeys where they would otherwise appear.',
  imageDir: 'fe-additional-allowances-3436',
  collegeUserQuery: '?userEmailAddress=bob@hopecollege.sch.uk',
  schoolUserQuery: '?userEmailAddress=rachael@courtland.sch.uk',
  userNeed:
    'As FE College hiring staff, I do not have the ability to offer additional allowances to jobseekers so I differentiate from schools.',
  devNote:
    'Remove the additional allowances box from the college online application form, Quick Apply and also from the job summary page for hiring staff, and ensure the feature does not appear in the job seeker journey. In this hiring staff prototype, create and edit job listing salary and check your answers pages hide allowances for college/FE organisations; the jobseeker prototype covers application form, Quick Apply and listing views.',
  successCriteria:
    'Neither Hiring Staff nor Job Seekers can see the additional allowances fields in either journey.',
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
