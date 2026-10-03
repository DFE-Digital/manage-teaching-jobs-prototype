
const authentication = require('../middleware/authentication')
const organisationHelper = require('../helpers/organisation')

module.exports = router => {

  router.get('/interruptions/complete-profile', authentication.checkIsAuthenticated, (req, res) => {
    res.render('interruptions/complete-profile')
  })

  router.get('/interruptions/profiles', authentication.checkIsAuthenticated, (req, res) => {
    res.render('interruptions/profiles')
  })

}