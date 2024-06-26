
const authentication = require('../middleware/authenticaton')

module.exports = router => {

  router.get('/jobs', authentication.checkIsAuthenticated, (req, res) => {
    res.render('jobs/index')
  })

  router.get('/jobs/example', authentication.checkIsAuthenticated, (req, res) => {

    res.render('jobs/example', {
      
    })
  })

  router.get('/jobs/:id', authentication.checkIsAuthenticated, (req, res) => {
    let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('jobs/show', {
      job
    })
  })

  router.get('/jobs/:id/applications', authentication.checkIsAuthenticated, (req, res) => {
    let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('jobs/applications', {
      job
    })
  })

  router.get('/jobs/:id/download', authentication.checkIsAuthenticated, (req, res) => {
    let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('jobs/download', {
      job
    })
  })

  router.get('/jobs/:id/applications_example', authentication.checkIsAuthenticated, (req, res) => {
    let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('jobs/applications_example', {
      job
    })
  })

  router.get('/jobs/:id/invitees', authentication.checkIsAuthenticated, (req, res) => {
    let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('jobs/invitees', {
      job
    })
  })

  router.get('/jobs/:id/preview', authentication.checkIsAuthenticated, (req, res) => {
    let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('jobs/preview', {
      job
    })
  })

}