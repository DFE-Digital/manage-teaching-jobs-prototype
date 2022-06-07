const express = require('express')
const router = express.Router()
const passport = require('passport')

const authenticationController = require('./controllers/authentication.js')
const jobsController = require('./controllers/jobs.js')

// Authentication middleware
const checkIsAuthenticated = (req, res, next) => {
  if (req.session.passport) {
    // the signed in user
    res.locals.passport = req.session.passport
    // the base URL for navigation
    res.locals.baseUrl = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`
    next()
  } else {
    delete req.session.data
    res.redirect('/sign-in')
  }
}

router.all('*', (req, res, next) => {
  res.locals.referrer = req.query.referrer
  res.locals.query = req.query
  res.locals.flash = req.flash('success') // pass through 'success' messages only
  next()
})

/// ------------------------------------------------------------------------ ///
/// AUTHENTICATION ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/sign-in', authenticationController.signIn)
router.post('/sign-in', passport.authenticate('local', {
  successRedirect: '/active-jobs',
  failureRedirect: '/sign-in',
  failureFlash: 'Enter valid sign-in details'
}))

router.get('/sign-out', authenticationController.signOut)

/// ------------------------------------------------------------------------ ///
/// Manage jobs
/// ------------------------------------------------------------------------ ///

router.get('/active-jobs', checkIsAuthenticated, jobsController.index)

/// ------------------------------------------------------------------------ ///
/// Create job listing
/// ------------------------------------------------------------------------ ///

router.post('/jobs/new/method', (req, res) => {

  if(req.body['create-job'] && req.body['create-job'].method == 'Yes') {
    res.redirect('/jobs/new/email-address')
  } else {
    res.redirect('/jobs/new/how')
  }

})

router.post('/jobs/new/upload', (req, res) => {

  if(req.body['create-job'] && req.body['create-job'].upload == 'Yes') {
    res.redirect('/jobs/new/file')
  } else {
    res.redirect('/jobs/new/check')
  }

})

router.post('/jobs/new/school-visits', (req, res) => {

  if(req.body['create-job'] && req.body['create-job']['school-visits'] == 'Yes') {
    res.redirect('/jobs/new/school-visits-email-address')
  } else {
    res.redirect('/jobs/new/about')
  }

})

module.exports = router
