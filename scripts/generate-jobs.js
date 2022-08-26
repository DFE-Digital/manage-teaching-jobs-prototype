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
const generateSubjects = require('./jobGenerators/subjects')
const generateWorkingPatterns = require('./jobGenerators/working-patterns')
const generateKeyStages = require('./jobGenerators/key-stages')


const generateJob = (params = {}) => {
  let job = {}
  job.id = params.id || ('' + faker.datatype.number({min: 123456, max: 999999}))

  job.status = params.status || faker.helpers.arrayElements(['Draft', 'Scheduled', 'Published', 'Closed'])

  job.organisation = params.organisation || faker.helpers.arrayElement(organisations)

  // For now the default includes all possible locations but hiring stafff can select a subset.
  job.locations = params.locations || organisationHelper.getLocations(job.organisation)

  job.role = params.role || faker.helpers.arrayElement(roles)

  job.title = params.title || generateTitle({organisation: job.organisation, role: job.role})

  job.keyStages = params.keyStages || generateKeyStages({organisation: job.organisation})

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
  ])

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

  if(job.hasAdditionalAllowances == 'No') {

    job.applicationMethod = params.applicationMethod || faker.helpers.arrayElement(['By email', 'Through a website'])

    if(job.applicationMethod == 'By email') {

      job.applicationForm = params.applicationForm || 'application.pdf'
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

  // About role
  job.isRoleSuitableForEarlyCareeerTeachers = params.isRoleSuitableForEarlyCareeerTeachers || faker.helpers.arrayElement(['Yes', 'No'])

  // Supporting documents

  // Dates

  return job
}

const generateJobs = () => {
  const jobs = []

  jobs.push(generateJob({organisation: organisations.find(organisation => organisation.name == 'Royal Academy Trust')}))
  jobs.push(generateJob())

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
