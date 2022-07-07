const fs = require('fs')
const path = require('path')
const faker =  require('@faker-js/faker').faker
faker.setLocale('en_GB');

// generators
const generateType = require('./organisationGenerators/type')

const generateSchool = (params = {}) => {
  let school = {}
  school.name = params.name || faker.company.companyName({format: 5}) + ' School'
  school.address = params.address || { address1: '10 Seed Street', town: 'London', postcode: 'N19 4PT' }
  return school
}

const generateSchools = (params = {}) => {
  const schools = []

  schools.push(generateSchool({
    address: { address1: '1 Owl Way', town: 'London', postcode: 'W9 4PT' }
  }))
  schools.push(generateSchool())
  schools.push(generateSchool())

  return schools
}

const generateOrg = (params = {}) => {
  let org = {}

  org.type = params.type || generateType()
  org.name = params.name || faker.company.companyName({format: 5})
  org.address = params.address || { address1: '123 Main Street', town: 'Some town', postcode: 'AB1 2CD' }

  if(org.type == 'MAT' || org.type == "LA") {
    org.schools = params.schools || generateSchools()
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
    type: 'School',
    name: 'Boom School'
  }))

  orgs.push(generateOrg({
    type: 'MAT',
    name: 'Boom Academy'
  }))

  orgs.push(generateOrg({
    type: 'LA',
    name: 'Boom Local Authority'
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

generateOrgsFile(path.join(__dirname, '../app/data/orgs.json'))
