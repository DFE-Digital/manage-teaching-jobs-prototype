const orgs = require('../data/orgs.json')

exports.findOne = (params) => {
  const users = [{
    username: 'anne@example.com',
    password: 'bat',
    organisation: orgs.find(org => org.name == 'Boom Academy Trust')
  }, {
    username: 'susy@example.com',
    password: 'bat',
    organisation: orgs.find(org => org.name == 'Boom Primary School')
  }]
  let user = {}

  user = users.find(user =>
    user.username === params.username &&
    user.password === params.password
  )

  return user
}
