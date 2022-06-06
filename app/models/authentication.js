exports.findOne = (params) => {
  const users = [{
    username: 'anne@example.com',
    password: 'bat',
    everthing: {},
    about: {},
    the: {},
    user: {}
  }, {
    username: 'susy@example.com',
    password: 'wrong',
    everthing: {},
    about: {},
    the: {},
    user: {}
  }]
  let user = {}

  user = users.find(user =>
    user.username === params.username &&
    user.password === params.password
  )

  return user
}
