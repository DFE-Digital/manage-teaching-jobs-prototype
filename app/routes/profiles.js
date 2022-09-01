
const authentication = require('../middleware/authenticaton')

module.exports = router => {

  router.get('/profiles', authentication.checkIsAuthenticated, (req, res) => {

    let roles = require('../data/roles').map(item => {
      return { text: item, value: item }
    })

    let phases = require('../data/phases').map(item => {
      return { text: item, value: item }
    })

    res.render('profiles/index', {
      roles,
      phases
    })
  })

  router.get('/profiles/:id', authentication.checkIsAuthenticated, (req, res) => {
    // let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('profiles/show', {
    })
  })

}