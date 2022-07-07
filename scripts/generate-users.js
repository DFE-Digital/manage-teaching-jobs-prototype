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
    username: 'anne@boomschool.com',
    organisation: organisations.find(org => org.name == 'Boom School')
  }))

  users.push(generateUser({
    username: 'susy@boomacademy.com',
    organisation: organisations.find(org => org.name == 'Boom Academy')
  }))

  users.push(generateUser({
    username: 'samsusy@boomla.com',
    organisation: organisations.find(org => org.name == 'Boom Local Authority')
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
