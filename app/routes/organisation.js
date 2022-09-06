
const authentication = require('../middleware/authenticaton')

module.exports = router => {

  router.get('/organisation', authentication.checkIsAuthenticated, (req, res) => {
    res.render('organisation/index')
  })

}