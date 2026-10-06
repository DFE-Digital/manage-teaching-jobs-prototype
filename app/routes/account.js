const users = require('../data/users.json')
const organisationHelper = require('../helpers/organisation')
const userHelper = require('../helpers/user')
const authentication = require('../middleware/authentication')

function safeReturnPath (value) {
  if (typeof value !== 'string') return null
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return null
  return value
}

function usersForProfilePicker () {
  return users.map(user => {
    user.organisation.hasMissingInformation = organisationHelper.hasMissingInformation(user.organisation)
    return user
  })
}

module.exports = router => {

  router.get('/account', authentication.checkIsAuthenticated, (req, res) => {
    res.render('account/index')
  })

  router.get('/account/sign-in', (req, res) => {
    res.render('account/sign-in')
  })

  router.get('/account/sign-in-as-profile', (req, res) => {
    res.render('account/sign-in-as-profile', {
      users: usersForProfilePicker()
    })
  })

  router.post('/account/sign-in', (req, res) => {
    const emailAddress = req.body.emailAddress
    const user = userHelper.getUser(emailAddress) || userHelper.getUser('rachael@courtland.sch.uk') || userHelper.getUser(users[0].emailAddress)

    res.locals.user = req.session.user = user

    const returnUrl = safeReturnPath(req.body.returnUrl)
    if (organisationHelper.hasMissingInformation(user.organisation)) {
      res.redirect('/interruptions/complete-profile')
    } else if (returnUrl) {
      res.redirect(returnUrl)
    } else {
      res.redirect('/interruptions/profiles')
    }
  })

  router.get('/sign-out', (req, res) => {
    res.locals.user = req.session.user = null
    res.redirect('/')
  })

  router.post('/account/new', (req, res) => {
    let user = userHelper.getUser(users[0].emailAddress)
    res.locals.user = req.session.user = user
    res.redirect('/account/new/confirmation')
  })

}