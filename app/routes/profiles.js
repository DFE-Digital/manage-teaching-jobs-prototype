
const authentication = require('../middleware/authenticaton')

module.exports = router => {

  router.get('/profiles', authentication.checkIsAuthenticated, (req, res) => {
    res.render('profiles/index')
  })

  router.get('/profiles/:id', authentication.checkIsAuthenticated, (req, res) => {
    // let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('profiles/show', {
    })
  })

}