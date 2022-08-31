const fs = require('fs')
const path = require('path')
const _ = require('lodash');
const faker =  require('@faker-js/faker').faker
faker.setLocale('en_GB');
const { DateTime } = require('luxon')
const roles = require('../app/data/roles.js')
const phases = require('../app/data/phases.js')

const generateKeyStages = require('./jobseekerGenerators/key-stages')
const generateSubjects = require('./generators/subjects')

const generateJobseeker = (params = {}) => {
  let jobseeker = {}

  jobseeker.emailAddress = params.emailAddress

  jobseeker.profile = params.profile || {}

  jobseeker.profile.status = _.get(params, 'profile.status')

  // Personal details
  jobseeker.profile.firstName = _.get(params, 'profile.firstName') || faker.name.firstName()
  jobseeker.profile.lastName = _.get(params, 'profile.lastName') || faker.name.lastName()
  jobseeker.profile.providePhoneNumber = _.get(params, 'profile.providePhoneNumber') || faker.helpers.arrayElement(['Yes', 'No'])

  if(jobseeker.profile.providePhoneNumber == 'Yes') {
    jobseeker.profile.phoneNumber = _.get(params, 'profile.phoneNumber') || faker.phone.number('020# ### ###')
  }


  // Roles
  jobseeker.profile.roles = _.get(params, 'profile.roles') || faker.helpers.arrayElements(roles, faker.datatype.number({min: 1, max: 2}))

  // Phase
  jobseeker.profile.phases = _.get(params, 'profile.phases') || faker.helpers.arrayElements(phases, faker.datatype.number({min: 1, max: 2}))

  // Key stages
  jobseeker.profile.keyStages = _.get(params, 'profile.keyStages') || generateKeyStages({
    phase: jobseeker.profile.phases[0]
  })

  if(jobseeker.profile.phases[0] == 'Secondary school') {
    jobseeker.profile.subjects = _.get(params, 'profile.subjects') || generateSubjects()
  }

  // Working patterns
  jobseeker.profile.workingPatterns = _.get(params, 'profile.workingPatterns') || faker.helpers.arrayElements(['Full time', 'Part time'], faker.datatype.number({min: 1, max: 2}))

  // Locations
  jobseeker.profile.locations = _.get(params, 'profile.locations') || [{
    location: 'London',
    radius: '5 miles'
  }]

  jobseeker.profile.qts = _.get(params, 'profile.qts') || faker.helpers.arrayElement(['Yes', 'No'])

  if(jobseeker.profile.qts == 'No') {
    jobseeker.profile.ect = _.get(params, 'profile.ect') || faker.helpers.arrayElement(['Yes', 'No'])
  }

  // Qualifications
  jobseeker.profile.qualifications = _.get(params, 'profile.qualifications') || [
    { type: 'GCSE', subject: 'Maths', grade: 'A', year: '2013', organisation: 'Bushey Meads School' },
    { type: 'GCSE', subject: 'English', grade: 'B', year: '2013', organisation: 'Bushey Meads School' },
    { type: 'GCSE', subject: 'Science', grade: 'B', year: '2013', organisation: 'Bushey Meads School' },
    { type: 'GCSE', subject: 'Geography', grade: 'B', year: '2013', organisation: 'Bushey Meads School' },
    { type: 'GCSE', subject: 'History', year: '2013', organisation: 'Bushey Meads School' },
    { type: 'GCSE', subject: 'Statistics', grade: 'A', year: '2013', organisation: 'Bushey Meads School' },
    { type: 'GCSE', subject: 'French', grade: 'B', year: '2013', organisation: 'Bushey Meads School' },
    { type: 'A level', subject: 'English', grade: 'A', year: '2015', organisation: 'Bushey Meads School' },
    { type: 'A level', subject: 'Maths', grade: 'C', year: '2015', organisation: 'Bushey Meads School' },
    { type: 'A level', subject: 'Science', grade: 'B', year: '2013', organisation: 'Aldenham College' },
    { type: 'Degree', subject: 'Multimedia Technology BSc', grade: '1st', year: '2019', organisation: 'University of Hertfordshire' },
    { type: 'Degree', subject: 'Social science PhD', organisation: 'UCL' }
  ]

  // Work history
  jobseeker.profile.workHistory = _.get(params, 'profile.workHistory') || [
    {
      employer: 'Colindale Primary School',
      role: 'Teacher',
      startDate: DateTime.fromObject({ year: 2018, month: 1 }).toISO(),
      endDate: DateTime.fromObject({ year: 2019, month: 12 }).toISO(),
      currentRole: 'No'
    },
    {
      employer: 'Courtland Primary School',
      role: 'Teacher',
      startDate: DateTime.fromObject({ year: 2020, month: 1 }).toISO(),
      currentRole: 'Yes'
    }
  ]

  // About
  jobseeker.profile.about = _.get(params, 'profile.about') || faker.lorem.paragraphs(2)

  return jobseeker
}

const generateJobseekers = () => {
  const jobseekers = []

  jobseekers.push(generateJobseeker())
  jobseekers.push(generateJobseeker())
  jobseekers.push(generateJobseeker())
  jobseekers.push(generateJobseeker())
  jobseekers.push(generateJobseeker())
  jobseekers.push(generateJobseeker())
  jobseekers.push(generateJobseeker())
  jobseekers.push(generateJobseeker())
  jobseekers.push(generateJobseeker())

  return jobseekers
}

/**
 * Generate JSON file
 *
 * @param {String} filePath Location of generated file
 * @param {String} count Number of applications to generate
 *
 */
const generateJobseekersFile = (filePath) => {
  const jobseekers = generateJobseekers()
  const filedata = JSON.stringify(jobseekers, null, 2)
  fs.writeFile(
    filePath,
    filedata,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`Jobseekers data file generated: ${filePath}`)
    }
  )
}

generateJobseekersFile(path.join(__dirname, '../app/data/jobseekers.json'))
