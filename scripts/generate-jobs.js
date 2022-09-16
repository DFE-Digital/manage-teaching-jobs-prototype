const fs = require('fs')
const path = require('path')
const faker =  require('@faker-js/faker').faker
faker.setLocale('en_GB');


const organisationHelper = require('../app/helpers/organisation')

const organisations = require('../app/data/organisations.json')
const users = require('../app/data/users.json')
const roles = require('../app/data/roles.js')

// generators
const generateTitle = require('./jobGenerators/title')
const generateSubjects = require('./generators/subjects')
const generateKeyStages = require('./jobGenerators/key-stages')


const generateJob = (params = {}) => {
  let job = {}
  job.id = params.id || ('' + faker.datatype.number({min: 123456, max: 999999}))

  job.status = params.status || faker.helpers.arrayElement(['Draft', 'Scheduled', 'Published', 'Closed'])

  job.organisation = params.organisation || faker.helpers.arrayElement(organisations)

  // For now the default includes all possible locations but hiring stafff can select a subset.
  job.locations = params.locations || organisationHelper.getLocations(job.organisation)

  job.role = params.role || faker.helpers.arrayElement(roles)

  job.title = params.title || generateTitle({organisation: job.organisation, role: job.role})

  let phase = 'Primary school'

  if(job.organisation.schools == 'School') {
    phase = job.organisation.schools[0].phase
  } else {
    phase = job.organisation.phase
  }

  job.keyStages = params.keyStages || generateKeyStages({phase})

  job.subjects = params.subjects || generateSubjects()

  job.contractType = params.contractType || faker.helpers.arrayElement([
    'Permanent',
    'Fixed term',
    'Maternity or parental leave cover'
  ])

  if(job.contractType == 'Fixed term' || job.contractType == 'Maternity or parental leave cover') {
    job.contractLength = params.contractLength || '6 months'
  }

  job.workingPatterns = params.workingPatterns || faker.helpers.arrayElements(['Full time', 'Part time'])

  if(job.workingPatterns.includes('Full time')) {
    job.fullTimeDetails = params.fullTimeDetails || '5 days a week'
  }

  if(job.workingPatterns.includes('Part time')) {
    job.partTimeDetails = params.partTimeDetails || '20 hours a week'
  }

  job.salaryDetails = params.salaryDetails || faker.helpers.arrayElements([
    'Full-time equivalent salary',
    'Actual salary',
    'Pay scale'
  ], faker.datatype.number({min: 1, max: 2}))

  if(job.salaryDetails.includes('Full-time equivalent salary')) {
    job.fullTimeEquivalentSalaryDetails = params.fullTimeEquivalentSalaryDetails || '£42,000'
  }

  if(job.salaryDetails.includes('Actual salary')) {
    job.actualSalaryDetails = params.actualSalaryDetails || '£31,000'
  }

  if(job.salaryDetails.includes('Pay scale')) {
    job.payScaleDetails = params.payScaleDetails || 'MP4 to MP6'
  }

  job.hasAdditionalAllowances = params.hasAdditionalAllowances || faker.helpers.arrayElement(['Yes', 'No'])

  if(job.hasAdditionalAllowances == 'Yes') {
    job.additionalAllowances = params.additionalAllowances || 'TLR is available.'
  }

  job.isUsingApplicationForm = params.isUsingApplicationForm || faker.helpers.arrayElement(['Yes', 'No'])

  if(job.isUsingApplicationForm == 'No') {

    job.applicationMethod = params.applicationMethod || faker.helpers.arrayElement(['By email', 'Through a website'])

    if(job.applicationMethod == 'By email') {

      job.applicationForm = params.applicationForm || {
        file: 'application-form.pdf',
        size: '2MB'
      }

      job.emailAddressForApplications = params.emailAddressForApplications || faker.helpers.arrayElement(users).username

    }

    if(job.applicationMethod == 'Through a website') {

      job.linkToWebsite = params.linkToWebsite || 'https://www.school.uk'

    }

  }

  job.offersSchoolVisits = params.offersSchoolVisits || faker.helpers.arrayElement(['Yes', 'No'])

  job.contactEmailAddress = params.contactEmailAddress || faker.helpers.arrayElement(users).username

  job.hasContactPhoneNumber = params.hasContactPhoneNumber || faker.helpers.arrayElement(['Yes', 'No'])

  if(job.hasContactPhoneNumber == 'Yes') {

    job.contactPhoneNumber = params.contactPhoneNumber || faker.phone.number('020# ### ###')

  }

  job.isRoleSuitableForEarlyCareeerTeachers = params.isRoleSuitableForEarlyCareeerTeachers || faker.helpers.arrayElement(['Yes', 'No'])

  job.skillsAndExperience = params.skillsAndExperience || faker.lorem.words(30)

  job.whatSchoolOffers = params.whatSchoolOffers || faker.lorem.words(20)

  job.hasSafeguardingCommitment = params.hasSafeguardingCommitment || faker.helpers.arrayElement(['Yes', 'No'])

  if(job.hasSafeguardingCommitment == 'Yes') {

    job.safeguardingCommitment = params.safeguardingCommitment || faker.lorem.words(30)

  }

  job.hasFurtherDetailsAboutTheRole = params.hasFurtherDetailsAboutTheRole || faker.helpers.arrayElement(['Yes', 'No'])

  if(job.hasSafeguardingCommitment == 'Yes') {

    job.furtherDetailsAboutTheRole = params.furtherDetailsAboutTheRole || faker.lorem.words(30)

  }

  job.hasAdditionalDocuments = params.hasAdditionalDocuments || faker.helpers.arrayElement(['Yes', 'No'])

  if(job.hasAdditionalDocuments == 'Yes') {

    job.additionalDocuments = params.additionalDocuments || faker.helpers.arrayElements([
      {
        file: 'job-description.pdf',
        size: '6MB'
      },
      {
        file: 'person-specification.pdf',
        size: '5MB'
      }
    ])

  }

  job.publishDate = params.publishDate || faker.date.future(0)

  job.closingDate = params.publishDate || faker.date.future(0, job.publishDate)

  job.closingTime = params.closingTime || faker.helpers.arrayElement(['9am', '12pm (midday)', '5pm', '11:59pm'])

  job.startDate = params.startDate || faker.date.future(0, job.closingDate)

  return job
}

const generateJobs = () => {
  const jobs = []

  users.forEach(user => {
    jobs.push(generateJob({
      organisation: user.organisation,
      status: 'Published',
      role: 'Teacher'
    }))
    jobs.push(generateJob({
      organisation: user.organisation,
      status: 'Published',
      role: 'Headteacher, deputy or assistant headteacher'
    }))
    jobs.push(generateJob({
      organisation: user.organisation,
      status: 'Published',
      role: 'Teaching assistant'
    }))
    for (let i = 0; i < 1; i++) {
      jobs.push(generateJob({
        organisation: user.organisation,
        status: 'Scheduled'
      }))
    }
    for (let i = 0; i < 1; i++) {
      jobs.push(generateJob({
        organisation: user.organisation,
        status: 'Draft'
      }))
    }
    for (let i = 0; i < 3; i++) {
      jobs.push(generateJob({
        organisation: user.organisation,
        status: 'Closed'
      }))
    }
  })

  return jobs
}

/**
 * Generate JSON file
 *
 * @param {String} filePath Location of generated file
 * @param {String} count Number of applications to generate
 *
 */
const generateJobsFile = (filePath) => {
  const jobs = generateJobs()
  const filedata = JSON.stringify(jobs, null, 2)
  fs.writeFile(
    filePath,
    filedata,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`Jobs data file generated: ${filePath}`)
    }
  )
}

generateJobsFile(path.join(__dirname, '../app/data/jobs.json'))
