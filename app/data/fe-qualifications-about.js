/**
 * FE “About the role” qualifications hints — design spec (#3080)
 * Prototype: GET /jobs/new/about (Hope college) with ?v1 | ?v2 | ?v3 | ?v4
 */

const COLLEGE_USER_QUERY = '?userEmailAddress=bob@hopecollege.sch.uk'

function withCollegeUser (path) {
  const joiner = path.indexOf('?') === -1 ? '?' : '&'
  return path + joiner + COLLEGE_USER_QUERY.slice(1)
}

module.exports = {
  guideTitle: 'FE qualifications and training (About the role)',
  guideDescription:
    'Design recommendations from card #3080: help hiring staff in further education show whether a teaching qualification is required and if training is offered, so jobseekers (e.g. industry experts) can find welcoming roles.',
  ticketRef: '#3080',
  ticketLabels: ['Content', 'Further Education (FE)', 'Design'],
  imageDir: 'fe-qualifications-about',
  prototypeBasePath: '/jobs/new/about',
  collegeUserQuery: COLLEGE_USER_QUERY,
  variations: [
    {
      id: 'v1',
      name: 'Baseline (as today)',
      query: 'v1',
      summary: 'No FE-specific guidance; ECT question shown; generic skills and benefits fields.',
      prototypePath: withCollegeUser('/jobs/new/about?v1'),
      screenshot: 'about-v1.png'
    },
    {
      id: 'v2',
      name: 'Hints and FE framing',
      query: 'v2',
      summary: 'Inset for hiring staff; relabelled skills field; hints on skills and benefits; FE teaching suitability instead of ECT.',
      prototypePath: withCollegeUser('/jobs/new/about?v2'),
      screenshot: 'about-v2.png'
    },
    {
      id: 'v3',
      name: 'Structured qualifications',
      query: 'v3',
      summary: 'v2 plus “Qualifications and training opportunities” radios and optional training details; hints on further details.',
      prototypePath: withCollegeUser('/jobs/new/about?v3'),
      screenshot: 'about-v3.png'
    },
    {
      id: 'v4',
      name: 'Content-improved version',
      query: 'v4',
      summary:
        'Single intro for college profile content; FE suitability and field hints; no inset or structured qualification radios; standard “further details” question.',
      prototypePath: withCollegeUser('/jobs/new/about?v4'),
      screenshot: 'about-v4.png'
    }
  ],
  jobseekerVariation: {
    id: 'v2',
    name: 'Listing flag and tooltip',
    query: 'v2',
    summary: '“Qualifications and training opportunities” heading with tag and hover guidance on the job listing (mock college preview).',
    prototypePath: '/jobs/new/check_preview?v2',
    screenshot: 'listing-v2.png'
  },
  suggestions: [
    {
      id: 'inset',
      title: 'FE intro inset before the form',
      body: 'One short paragraph tells hiring staff that candidates look for required qualifications and on-the-job training.',
      appliesTo: 'v2, v3',
      screenshot: 'about-v2.png',
      anchor: 'inset'
    },
    {
      id: 'skills',
      title: 'Skills, experience and qualifications field',
      body: 'Relabel for FE; hint with construction lecturer example; optional “what good looks like” details.',
      appliesTo: 'v2, v3, v4',
      screenshot: 'about-v4-skills.png',
      anchor: 'skills'
    },
    {
      id: 'benefits',
      title: 'What the college offers (including training)',
      body: 'Hint prompts colleges to mention support towards a teaching qualification.',
      appliesTo: 'v2, v3, v4',
      screenshot: 'about-v4-benefits.png',
      anchor: 'benefits'
    },
    {
      id: 'qualifications',
      title: 'Qualifications and training opportunities',
      body: 'Structured radios: required / desirable / not required / train on the job; conditional text for training offer.',
      appliesTo: 'v3',
      screenshot: 'about-v3.png',
      anchor: 'qualifications'
    },
    {
      id: 'ect',
      title: 'Replace ECT question for FE',
      body: 'Hide school-centric ECT/NQT wording; ask if the role suits someone new to teaching in FE.',
      appliesTo: 'v2, v3, v4',
      screenshot: 'about-v4-ect.png',
      anchor: 'ect'
    },
    {
      id: 'further-details',
      title: 'Further details about the role',
      body: 'Yes/No with optional free text. v3 adds a hint not to repeat qualifications; v4 uses the standard question only.',
      appliesTo: 'v3, v4',
      screenshot: 'about-v4-further-details.png',
      anchor: 'further-details'
    },
    {
      id: 'profile-intro',
      title: 'College profile intro',
      body: 'One sentence that college description and safeguarding from the profile appear on the listing, with expandable previews.',
      appliesTo: 'v4',
      screenshot: 'about-v4-profile-intro.png',
      anchor: 'profile-intro'
    },
    {
      id: 'listing',
      title: 'Jobseeker listing signal',
      body: 'Tag “Training towards teaching qualification available” with tooltip on hover (search filter out of scope for this spike).',
      appliesTo: 'listing v2',
      screenshot: 'listing-v2.png',
      anchor: 'listing'
    }
  ],
  implementation: {
    view: 'versions/1-2/views/jobs/new/about.njk',
    data: 'app/data/fe-qualifications-about.js',
    styles: 'app/assets/sass/patterns/_documentation.scss (.app-documentation-figure)',
    imageRoute: 'GET /documentation/images/:dir/:file (version-prefixed, e.g. /1-2/documentation/images/…)'
  }
}