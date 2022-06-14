const express = require('express')
const router = express.Router()
const passport = require('passport')
const authenticationController = require('./controllers/authentication.js')

// Authentication middleware


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
  successRedirect: '/jobs',
  failureRedirect: '/sign-in',
  failureFlash: 'Enter valid sign-in details'
}))

router.get('/sign-out', authenticationController.signOut)

require('./routes/create-job-listing')(router)

module.exports = router
