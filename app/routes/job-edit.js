
const authentication = require('../middleware/authentication')
const Validator = require('../helpers/validator')
const { isCollegeFeCreateJob } = require('../lib/fe-parity')

function renderEditJobPage (view, req, res) {
  res.render(view, {
    hideAdditionalAllowances: isCollegeFeCreateJob(
      req.session.data || {},
      req.session.user
    )
  })
}

module.exports = router => {

  router.get('/jobs/edit/salary', authentication.checkIsAuthenticated, (req, res) => {
    renderEditJobPage('jobs/edit/salary', req, res)
  })

  router.get('/jobs/edit/check', authentication.checkIsAuthenticated, (req, res) => {
    renderEditJobPage('jobs/edit/check', req, res)
  })

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