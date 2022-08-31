const fs = require('fs')
const path = require('path')
const faker =  require('@faker-js/faker').faker
faker.setLocale('en_GB');

const generateProfile = (params = {}) => {
  let profile = {}



  return profile
}

const generateProfiles = () => {
  const profiles = []

  profiles.push(generateProfile())

  return profiles
}

/**
 * Generate JSON file
 *
 * @param {String} filePath Location of generated file
 * @param {String} count Number of applications to generate
 *
 */
const generateProfilesFile = (filePath) => {
  const profiles = generateProfiles()
  const filedata = JSON.stringify(profiles, null, 2)
  fs.writeFile(
    filePath,
    filedata,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`Profiles data file generated: ${filePath}`)
    }
  )
}

generateProfilesFile(path.join(__dirname, '../app/data/profiles.json'))
