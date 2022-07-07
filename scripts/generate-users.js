const fs = require('fs')
const path = require('path')
const faker =  require('@faker-js/faker').faker
faker.setLocale('en_GB');

const organisations = require('../app/data/orgs.json')

const generateUser = (params = {}) => {
  let user = {}

  user.username = params.username
  user.password = params.password || 'tv'
  user.organisation = params.organisation || organisations[0]

  return user
}

const generateUsers = () => {
  const users = []

  users.push(generateUser({
    username: 'anne@example.com',
    organisation: organisations[0]
  }))

  users.push(generateUser({
    username: 'susy@example.com',
    organisation: organisations[1]
  }))

  return users
}

/**
 * Generate JSON file
 *
 * @param {String} filePath Location of generated file
 * @param {String} count Number of applications to generate
 *
 */
const generateUsersFile = (filePath) => {
  const users = generateUsers()
  const filedata = JSON.stringify(users, null, 2)
  fs.writeFile(
    filePath,
    filedata,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`Users data file generated: ${filePath}`)
    }
  )
}

generateUsersFile(path.join(__dirname, '../app/data/users.json'))
