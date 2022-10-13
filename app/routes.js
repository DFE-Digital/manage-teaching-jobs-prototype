const express = require('express')
const router = express.Router()

router.all('*', (req, res, next) => {
  res.locals.referrer = req.query.referrer
  res.locals.path = req.path
  res.locals.protocol = req.protocol
  res.locals.hostname = req.hostname
  res.locals.query = req.query
  res.locals.user = req.session.user
  res.locals.flash = req.flash('success') // pass through 'success' messages only
  next()
})

require('./routes/interruptions')(router)
require('./routes/organisation')(router)
require('./routes/account')(router)
require('./routes/job-create')(router)
require('./routes/job-edit')(router)
require('./routes/jobs')(router)
require('./routes/jobseekers')(router)

module.exports = router
