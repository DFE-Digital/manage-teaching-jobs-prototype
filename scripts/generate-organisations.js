const fs = require('fs')
const path = require('path')
const faker =  require('@faker-js/faker').faker
faker.setLocale('en_GB');
const phases = require('../app/data/phases.js')

const generateSchool = (params = {}) => {
  let school = {}
  school.name = params.name || faker.company.name() + ' School'
  school.address = params.address || { address1: '10 Seed Street', town: 'London', postcode: 'N19 4PT' }
  school.phase = params.phase || 'Primary school'
  return school
}

const generateSchools = (params = {}) => {
  const schools = []

  schools.push(generateSchool({
    phase: 'Nursery school'
  }))
  schools.push(generateSchool({
    phase: 'Primary school'
  }))
  schools.push(generateSchool({
    address: { address1: '2 Owl Way', town: 'London', postcode: 'W6 1PT' },
    phase: 'Middle school'
  }))
  schools.push(generateSchool({
    address: { address1: '3 Owl Way', town: 'London', postcode: 'W7 2PT' },
    phase: 'Secondary school'
  }))
  schools.push(generateSchool({
    address: { address1: '4 Owl Way', town: 'London', postcode: 'W8 3PT' },
    phase: 'Sixth form or college'
  }))
  schools.push(generateSchool({
    address: { address1: '5 Owl Way', town: 'London', postcode: 'W9 4PT' },
    phase: 'Through school'
  }))

  return schools
}

const generateOrg = (params = {}) => {
  let org = {}

  org.type = params.type || faker.helpers.arrayElement([ 'School', 'MAT', 'LA' ])
  org.name = params.name || faker.company.name({format: 5})
  org.address = params.address || {
    address1: '50 Lawrence Street',
    town: 'Mill Hill',
    postcode: 'NW7 4YK'
  }

  if(org.type == 'MAT' || org.type == "LA") {
    org.schools = params.schools || generateSchools()
  }

  if(org.type == 'School') {
    org.phase = params.phase || faker.helpers.arrayElement(phases)
  }

  return org
}

/*
 if a school then locations=1

 if a MAT then locations>1

 if a LA then locations=1 or locations>1

 if advert is at multiple locations within a MAT then it would show
    https://teaching-vacancies.service.gov.uk/jobs/trust-primary-assistant-headteacher

 if advert is at one location within MAT then would show standard job advert

 All MATs have a head office. A head office is the location for the MAT, it's not an org/school.

 An LA does not ever have a head office.

 LAs cannot choose to accept applications using the service's form.

*/

const generateOrgs = () => {
  const orgs = []

  orgs.push(generateOrg({
    name: 'Courtland Primary School',
    type: 'School',
    phase: 'Primary school'
  }))

  orgs.push(generateOrg({
    name: 'Bushey Meads Secondary School',
    type: 'School',
    phase: 'Secondary school'
  }))

  orgs.push(generateOrg({
    name: 'Royal Academy Trust',
    type: 'MAT'
  }))

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
