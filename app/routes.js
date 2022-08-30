const express = require('express')
const router = express.Router()

router.all('*', (req, res, next) => {
  res.locals.referrer = req.query.referrer
  res.locals.query = req.query
  res.locals.user = req.session.user
  res.locals.flash = req.flash('success') // pass through 'success' messages only
  next()
})

require('./routes/account')(router)
require('./routes/create-job-listing')(router)
require('./routes/jobs')(router)

module.exports = router
