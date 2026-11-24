
const authentication = require('../middleware/authentication')

function redirectToHome (req, res) {
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
  res.redirect('/home' + (query ? `?${query}` : ''))
}

module.exports = router => {

  router.get('/interruptions/complete-profile', authentication.checkIsAuthenticated, (req, res) => {
    res.render('interruptions/complete-profile')
  })

  router.get('/interruptions/profiles', authentication.checkIsAuthenticated, (req, res) => {
    if (req.query.legacy !== undefined) {
      res.render('interruptions/profiles')
      return
    }
    redirectToHome(req, res)
  })

}