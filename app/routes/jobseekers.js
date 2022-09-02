
const authentication = require('../middleware/authenticaton')

module.exports = router => {

  router.get('/jobseekers', authentication.checkIsAuthenticated, (req, res) => {

    let roles = require('../data/roles').map(item => {
      return { text: item, value: item }
    })

    let phases = require('../data/phases').map(item => {
      return { text: item, value: item }
    })

    res.render('jobseekers/index', {
      roles,
      phases
    })
  })

  router.get('/jobseekers/:id', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)
    res.render('jobseekers/show', { jobseeker })
  })
}