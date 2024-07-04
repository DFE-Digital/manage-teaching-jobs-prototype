
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
    let user = req.session.user
    let job = req.session.user.jobs.find(job => job.id == req.params.id)
    let jobseekers = user.jobseekers.map(jobseeker => {
      return jobseeker
    })

    res.render('jobs/applications', {
      job,
      jobseekers
    })
  })

  router.get('/jobs/:id/download', authentication.checkIsAuthenticated, (req, res) => {
    let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('jobs/download', {
      job
    })
  })

  router.get('/jobs/:id/tag', authentication.checkIsAuthenticated, (req, res) => {
    let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('jobs/tag', {
      job
    })
  })

  router.post('/jobs/:id/tag', (req, res) => {
      
    req.flash('success', 'Tags applied')
    res.redirect(`/jobs/${req.params.id}/applications`)

  })

  router.get('/jobs/:id/tag_single', authentication.checkIsAuthenticated, (req, res) => {
    let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('jobs/tag_single', {
      job
    })
  })

  router.post('/jobs/:id/tag_single', (req, res) => {
      
    req.flash('success', 'Tag applied')
    res.redirect(`/jobs/${req.params.id}/applications`)

  })

  router.get('/jobs/:id/interview', authentication.checkIsAuthenticated, (req, res) => {
    let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('jobs/interview', {
      job
    })
  })

  router.get('/jobs/:id/interview_single', authentication.checkIsAuthenticated, (req, res) => {
    let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('jobs/interview_single', {
      job
    })
  })

  router.post('/jobs/:id/interview_single', (req, res) => {
      
    req.flash('success', 'Interview details saved')
    res.redirect(`/jobs/${req.params.id}/applications`)

  })

  router.post('/jobs/:id/interview', (req, res) => {
      
    req.flash('success', 'Interview details saved')
    res.redirect(`/jobs/${req.params.id}/applications`)

  })

  router.get('/jobs/:id/tag_single', authentication.checkIsAuthenticated, (req, res) => {
    let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('jobs/tag_single', {
      job
    })
  })

  router.get('/jobs/:id/applications_example', authentication.checkIsAuthenticated, (req, res) => {
    let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('jobs/applications_example', {
      job
    })
  })

  router.get('/jobs/:id/applications_example_shortlisted', authentication.checkIsAuthenticated, (req, res) => {
    let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('jobs/applications_example_shortlisted', {
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