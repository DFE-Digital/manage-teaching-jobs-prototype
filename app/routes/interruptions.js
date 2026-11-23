
const authentication = require('../middleware/authentication')
const organisationHelper = require('../helpers/organisation')

module.exports = router => {

  router.get('/interruptions/complete-profile', authentication.checkIsAuthenticated, (req, res) => {
    res.render('interruptions/complete-profile')
  })

  router.get('/interruptions/profiles', authentication.checkIsAuthenticated, (req, res) => {
    if (req.query.legacy === undefined && req.query.v2 === undefined) {
      const params = new URLSearchParams()
      for (const [key, value] of Object.entries(req.query)) {
        if (key === 'v2' || key === 'legacy') continue
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v))
        } else if (value !== undefined) {
          params.append(key, value)
        }
      }
      const query = params.toString()
      res.redirect('/interruptions/profiles?v2' + (query ? `&${query}` : ''))
      return
    }
    res.render('interruptions/profiles')
  })

}