const express = require('express')
const router = express.Router()
const users = require('./data/users.json')

router.all('*', (req, res, next) => {
  res.locals.referrer = req.query.referrer
  res.locals.query = req.query
  res.locals.user = req.session.user
  res.locals.flash = req.flash('success') // pass through 'success' messages only
  next()
})

router.post('/sign-in', (req, res) => {
  res.locals.user = req.session.user = users[0]
  res.redirect('/jobs')
})

router.get('/sign-out', (req, res) => {
  res.locals.user = req.session.user = null
  res.redirect('/')
})

router.post('/create-account', (req, res) => {
  res.locals.user = req.session.user = {
    username: req.body.emailAddress,
    password: req.body.password
  }
  res.redirect('/create-account/confirmation')
})

require('./routes/create-job-listing')(router)

module.exports = router
