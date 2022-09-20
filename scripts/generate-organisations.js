const fs = require('fs')
const path = require('path')
const faker =  require('@faker-js/faker').faker
faker.setLocale('en_GB');
const _ = require('lodash');
const phases = require('../app/data/phases.js')
const { v4: uuidv4 } = require('uuid')

const generateSchool = (params = {}) => {
  let school = {}
  school.id = uuidv4()

  // GIAS
  school.name = params.name || faker.company.name() + ' School'
  school.address = params.address || { address1: '10 Seed Street', town: 'London', postcode: 'N19 4PT' }
  school.type = params.type || faker.helpers.arrayElement(['Academy'])
  school.phase = params.phase || faker.helpers.arrayElement(phases)
  school.ageGroup = params.ageGroup || faker.helpers.arrayElement(['11 to 16'])
  school.size = params.ageGroup || faker.helpers.arrayElement(['1000', '500', '100'])

  // Not GIAS

  if(params.website === null) {
    school.website = null
  } else {
    school.website = params.website || faker.internet.url()
  }

  if(params.emailAddress === null) {
    school.emailAddress = null
  } else {
    school.emailAddress = params.emailAddress || 'email@' + school.name.toLowerCase().replace(/ /g, "") + '.org.uk'
  }

  if(params.about === null) {
    school.about = null
  } else {
    school.about = params.about || faker.lorem.paragraphs(2, '\n\n')
  }

  if(params.supportForEmployees === null) {
    school.supportForEmployees = null
  } else {
    school.supportForEmployees = params.supportForEmployees || faker.lorem.sentences(1)
  }

  if(params.safeguardingCommitment === null) {
    school.safeguardingCommitment = null
  } else {
    school.safeguardingCommitment = params.safeguardingCommitment || faker.lorem.paragraphs(2, '\n\n')
  }

  if(params.logo === null) {
    school.logo = null
  } else {
    school.logo = params.logo || faker.image.abstract(100, 100)
  }

  if(params.photo === null) {
    school.photo = null
  } else {
    school.photo = params.photo || faker.image.abstract(640, 320)
  }

  return school
}

const generateOrg = (params = {}) => {
  let org = {}

  org.name = params.name || faker.company.name({format: 5})

  org.address = params.address || {
    address1: '50 Lawrence Street',
    town: 'Mill Hill',
    postcode: 'NW7 4YK'
  }

  if(params.website === null) {
    org.website = null
  } else {
    org.website = params.website || faker.internet.url()
  }

  if(params.emailAddress === null) {
    org.emailAddress = null
  } else {
    org.emailAddress = params.emailAddress || 'email@' + org.name.toLowerCase().replace(/ /g, "") + '.org.uk'
  }

  if(params.about === null) {
    org.about = null
  } else {
    org.about = params.about || faker.lorem.paragraphs(2, '\n\n')
  }

  if(params.supportForEmployees === null) {
    org.supportForEmployees = null
  } else {
    org.supportForEmployees = params.supportForEmployees || faker.lorem.sentences(1)
  }

  if(params.safeguardingCommitment === null) {
    org.safeguardingCommitment = null
  } else {
    org.safeguardingCommitment = params.safeguardingCommitment || faker.lorem.paragraphs(2, '\n\n')
  }

  if(params.logo === null) {
    org.logo = null
  } else {
    org.logo = params.logo || faker.image.abstract(100, 100)
  }

  if(params.photo === null) {
    org.photo = null
  } else {
    org.photo = params.photo || faker.image.abstract(640, 320)
  }

  org.schools = params.schools

  return org
}

/*
 Advert at MAT
 https://teaching-vacancies.service.gov.uk/jobs/trust-primary-assistant-headteacher

 All MATs have a head office. A head office is the location for the MAT, it's not an org/school.

 An LA does not have a head office.

 LAs cannot choose to accept applications using the service's form.
*/

const generateOrgs = () => {
  const orgs = []

  /*************************************************
   * Primary school
   *************************************************/

  // orgs.push(generateOrg({
  //   name: 'Courtland Primary School',
  //   phase: 'Primary school',
  //   website: null,
  //   emailAddress: null,
  //   about: null,
  //   supportForEmployees: null,
  //   safeguardingCommitment: null,
  //   logo: null,
  //   photo: null
  // }))

  orgs.push(generateSchool({
    name: 'Courtland Primary School',
    phase: 'Primary school',
    logo: '/public/images/logos/courtland.png'
  }))

  /*************************************************
   * Secondary school
   *************************************************/

  orgs.push(generateSchool({
    name: 'Bushey Meads Secondary School',
    phase: 'Secondary school',
    website: null,
    emailAddress: null,
    about: null,
    supportForEmployees: null,
    safeguardingCommitment: null,
    logo: null,
    photo: null
  }))

  /*************************************************
   * MAT with primary schools
   *************************************************/

  let matSchool1 = generateSchool({ phase: 'Primary school', about: null })
  let matSchool2 = generateSchool({ phase: 'Primary school'})
  let matSchool3 = generateSchool({ phase: 'Primary school'})
  let matSchool4 = generateSchool({ phase: 'Primary school', about: null })
  let matSchool5 = generateSchool({ phase: 'Primary school'})

  orgs.push(matSchool1)
  orgs.push(matSchool2)
  orgs.push(matSchool3)
  orgs.push(matSchool4)
  orgs.push(matSchool5)

  orgs.push(generateOrg({
    name: 'Royal Academy Trust',
    type: 'MAT',
    logo: '/public/images/logos/royal.png',
    schools: [
      matSchool1,
      matSchool2,
      matSchool3,
      matSchool4,
      matSchool5
    ]
  }))

  // orgs.push(generateOrg({
  //   name: 'Royal Academy Trust',
  //   type: 'MAT',
  //   website: null,
  //   emailAddress: null,
  //   about: null,
  //   supportForEmployees: null,
  //   safeguardingCommitment: null,
  //   logo: null,
  //   photo: null,
  //   schools: [
  //     matSchool1,
  //     matSchool2,
  //     matSchool3,
  //     matSchool4,
  //     matSchool5
  //   ]
  // }))

  /*************************************************
   * LA
   *************************************************/

  orgs.push(generateOrg({
    name: 'Barnet Local Authority',
    type: 'LA'
  }))

  return orgs
}

/**
 * Generate JSON file
 *
 * @param {String} filePath Location of generated file
 * @param {String} count Number of applications to generate
 *
 */
const generateOrgsFile = (filePath) => {
  const orgs = generateOrgs()
  const filedata = JSON.stringify(orgs, null, 2)
  fs.writeFile(
    filePath,
    filedata,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`Orgs data file generated: ${filePath}`)
    }
  )
}

generateOrgsFile(path.join(__dirname, '../app/data/organisations.json'))
