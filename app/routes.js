const express = require('express')
const config = require('./config')
const authentication = require('./middleware/authentication')
const router = express.Router()

function sharingOrigin (req) {
  const protocol = req.protocol || 'http'
  const headerHost = req.get('x-forwarded-host') || req.get('host') || 'localhost'
  const colon = headerHost.lastIndexOf(':')
  const hostname = colon === -1 ? headerHost : headerHost.slice(0, colon)
  const port = colon === -1 ? '' : headerHost.slice(colon + 1)
  const publicPort = String(process.env.PORT || config.port)
  const browserSyncPort = String(Number(publicPort) - 50)
  const host = port === browserSyncPort ? `${hostname}:${publicPort}` : headerHost
  return `${protocol}://${host}`
}

router.use(authentication.bootstrapUserFromQuery)

router.use((req, res, next) => {
  res.locals.referrer = req.query.referrer
  res.locals.path = req.path
  res.locals.protocol = req.protocol
  res.locals.hostname = req.hostname
  res.locals.host = req.get('host')
  res.locals.sharingOrigin = sharingOrigin(req)
  res.locals.query = req.query
  res.locals.user = req.session.user
  res.locals.flash = req.flash('success') // pass through 'success' messages only
  next()
})

require('./routes/interruptions')(router)
require('./routes/organisation')(router)
require('./routes/account')(router)
require('./routes/service-nav')(router)
require('./routes/job-create')(router)
require('./routes/job-edit')(router)
require('./routes/jobs')(router)
require('./routes/jobseekers')(router)

router.get('/documentation', (req, res) => {
  res.redirect('/documentation/about')
})

router.get('/documentation/about', (req, res) => {
  res.render('documentation/about.html')
})

router.get('/documentation/fe-additional-allowances-3436', (req, res) => {
  const guide = require('./data/fe-additional-allowances-3436')
  res.render('documentation/fe-additional-allowances-3436.html', { guide })
})

module.exports = router
