const fs = require('fs')
const path = require('path')
const faker =  require('@faker-js/faker').faker
faker.setLocale('en_GB');

const organisations = require('../app/data/organisations.json')

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
    username: 'rachael@courtland.sch.uk',
    organisation: organisations.find(org => org.name == 'Courtland Primary School')
  }))

  users.push(generateUser({
    username: 'susy@busheymeads.sch.uk',
    organisation: organisations.find(org => org.name == 'Bushey Meads Primary School')
  }))

  users.push(generateUser({
    username: 'leonie@lssecondary.sch.uk',
    organisation: organisations.find(org => org.name == 'LS Secondary School')
  }))

  users.push(generateUser({
    username: 'molly@mlsecondary.sch.uk',
    organisation: organisations.find(org => org.name == 'ML Secondary School')
  }))

  users.push(generateUser({
    username: 'alison@royalacademytrust.uk',
    organisation: organisations.find(org => org.name == 'Royal Academy Trust')
  }))

  users.push(generateUser({
    username: 'ben@svelteacademytrust.uk',
    organisation: organisations.find(org => org.name == 'Svelte Academy Trust')
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
