
const authentication = require('../middleware/authenticaton')
const organisationHelper = require('../helpers/organisation')

module.exports = router => {

  router.get('/organisation-incomplete', authentication.checkIsAuthenticated, (req, res) => {
    res.render('organisation-incomplete/index')
  })

}