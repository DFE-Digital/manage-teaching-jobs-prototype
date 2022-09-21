
const authentication = require('../middleware/authenticaton')
const Validator = require('../helpers/validator')

module.exports = router => {

  router.get('/jobs/edit/:id/role', (req, res) => {
    let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('jobs/edit/role', {
      job
    })
  })

  router.post('/jobs/edit/:id/role', (req, res) => {
    let id = req.params.id
    let job = req.session.user.jobs.find(job => job.id == req.params.id)

    job.role = req.body.editJob.role

    req.flash('success', 'Job listing saved')

    res.redirect(`/jobs/${req.params.id}`)
  })

}