
const authentication = require('../middleware/authenticaton')

module.exports = router => {

  router.get('/organisation-settings', authentication.checkIsAuthenticated, (req, res) => {
    res.render('organisation-settings/index')
  })

}