const users = require('../data/users.json')
const organisations = require('../data/organisations.json')
const jobs = require('../data/jobs.json')
const jobseekers = require('../data/jobseekers.json')
const organisationHelper = require('../helpers/organisation')
const userHelper = require('../helpers/user')
const authentication = require('../middleware/authenticaton')

module.exports = router => {

  router.get('/account', authentication.checkIsAuthenticated, (req, res) => {
    res.render('account/index')
  })

  router.get('/account/sign-in', (req, res) => {
    res.render('account/sign-in', {
      users: users.map(user => {
        user.organisation.hasMissingInformation = organisationHelper.hasMissingInformation(user.organisation)
        return user
      })
    })
  })

  router.get('/account/sign-in', (req, res) => {
    res.render('account/sign-in', {
      users: users.map(user => {
        user.organisation.hasMissingInformation = organisationHelper.hasMissingInformation(user.organisation)
        return user
      })
    })
  })

  router.post('/account/sign-in', (req, res) => {

    let user

    if(req.body.emailAddress) {
      user = userHelper.getUser(req.body.emailAddress)
    }

    // very defensive because we can assume that if an emailAddress has been submitted
    // then it will be a valid email address for an existing user
    // but just in case we'll grab the the first user's email address
    // and use that to retrieve a fully built user object
    if(!user) {
      user = userHelper.getUser(users[0].emailAddress)
    }

    res.locals.user = req.session.user = user

    if(organisationHelper.hasMissingInformation(user.organisation)) {
      res.redirect('/interruptions/complete-profile')
    } else if(req.body.returnUrl) {
      res.redirect(req.body.returnUrl)
    } else {
      res.redirect('/interruptions/profiles')
      // res.redirect('/jobs')
    }
  })

  router.get('/sign-out', (req, res) => {
    res.locals.user = req.session.user = null
    res.redirect('/')
  })

  router.post('/account/new', (req, res) => {
    res.locals.user = req.session.user = {
      username: req.body.emailAddress,
      password: req.body.password,
      organisation: organisations.find(org => org.name == 'Bushey Meads Secondary School')
    }
    res.redirect('/account/new/confirmation')
  })

}