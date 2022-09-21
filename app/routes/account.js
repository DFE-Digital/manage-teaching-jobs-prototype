const users = require('../data/users.json')
const organisations = require('../data/organisations.json')
const jobs = require('../data/jobs.json')
const jobseekers = require('../data/jobseekers.json')
const organisationHelper = require('../helpers/organisation')

module.exports = router => {

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
      user = users.find(user => user.username == req.body.emailAddress)
    } else {
      user = users[0]
    }

    // add jobs to the user
    user.jobs = jobs.filter(job => job.organisation.name == user.organisation.name)

    if(user.organisation.schools) {
      user.jobseekers = jobseekers
    } else {
      user.jobseekers = jobseekers.filter(jobseeker => {
        return jobseeker.profile.phases.includes(user.organisation.phase)
      })
    }

    res.locals.user = req.session.user = user

    let missingOrganisationInformation = organisationHelper.getMissingInformation(user.organisation)

    if(missingOrganisationInformation.length) {
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