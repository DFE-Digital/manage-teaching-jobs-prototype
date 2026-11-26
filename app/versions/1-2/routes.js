const express = require('express')
const fs = require('fs')
const path = require('path')
const config = require('../../config')
const authentication = require('./middleware/authentication')
const { isCollegeFeCreateJob } = require('./lib/fe-parity')
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

// Create listing screens use user.organisation in templates; require sign-in (or ?userEmailAddress=)
router.use('/jobs/new', authentication.checkIsAuthenticated)

router.use((req, res, next) => {
  res.locals.referrer = req.query.referrer
  res.locals.path = req.path
  res.locals.protocol = req.protocol
  res.locals.hostname = req.hostname
  res.locals.host = req.get('host')
  res.locals.sharingOrigin = sharingOrigin(req)
  res.locals.query = req.query
  res.locals.user = req.session.user
  res.locals.hideAdditionalAllowances = isCollegeFeCreateJob(
    res.locals.data || req.session.data || {},
    req.session.user
  )
  res.locals.flash = req.flash('success') // pass through 'success' messages only
  next()
})

router.get('/home', authentication.checkIsAuthenticated, (req, res) => {
  res.render('interruptions/profiles', {
    homePage: true
  })
})

require('./routes/interruptions')(router)
require('./routes/organisation')(router)
require('./routes/account')(router)
require('./routes/service-nav')(router)
require('./routes/job-create')(router)
require('./routes/job-edit')(router)
require('./routes/jobs')(router)
require('./routes/jobseekers')(router)

const DOC_IMAGE_ROOT = path.join(__dirname, '../../assets/images/documentation')

router.get('/documentation/images/:dir/:file', (req, res) => {
  const { dir, file } = req.params
  if (!/^[a-z0-9-]+$/.test(dir) || !/^[a-z0-9.-]+\.png$/.test(file)) {
    return res.sendStatus(400)
  }
  const resolved = path.resolve(DOC_IMAGE_ROOT, dir, file)
  if (!resolved.startsWith(path.resolve(DOC_IMAGE_ROOT) + path.sep)) {
    return res.sendStatus(400)
  }
  if (!fs.existsSync(resolved)) {
    return res.sendStatus(404)
  }
  res.type('png')
  res.sendFile(resolved)
})

router.get('/documentation', (req, res) => {
  res.redirect('/documentation/about')
})

router.get('/documentation/about', (req, res) => {
  res.render('documentation/about.html')
})

const buildJobListingFlowGuide = require('./data/job-listing-flow')

router.get('/documentation/job-listing-flow', (req, res) => {
  res.render('documentation/job-listing-flow.html', {
    guide: buildJobListingFlowGuide()
  })
})

router.get('/documentation/job-listing-flow.html', (req, res) => {
  res.redirect(301, '/documentation/job-listing-flow')
})

const buildJobListingFlowImprovements = require('./data/job-listing-flow-improvements')

router.get('/documentation/job-listing-flow-improvements', (req, res) => {
  res.render('documentation/job-listing-flow-improvements.html', {
    guide: buildJobListingFlowImprovements()
  })
})

router.get('/documentation/job-listing-flow-improvements.html', (req, res) => {
  res.redirect(301, '/documentation/job-listing-flow-improvements')
})

router.get('/documentation/your-account', (req, res) => {
  res.render('documentation/your-account', {
    guide: require('../../data/your-account')
  })
})

router.get('/documentation/your-account.html', (req, res) => {
  res.redirect(301, '/documentation/your-account')
})

router.get('/documentation/fe-qualifications-about', (req, res) => {
  res.render('documentation/fe-qualifications-about', {
    guide: require('../../data/fe-qualifications-about')
  })
})

router.get('/documentation/fe-qualifications-about.html', (req, res) => {
  res.redirect(301, '/documentation/fe-qualifications-about')
})

module.exports = router
