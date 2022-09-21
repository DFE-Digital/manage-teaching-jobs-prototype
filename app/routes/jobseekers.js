
const authentication = require('../middleware/authenticaton')
const _ = require('lodash')

module.exports = router => {

  router.get('/jobseekers', authentication.checkIsAuthenticated, (req, res) => {

    let jobCheckboxes = req.session.user.jobs
      .filter(job => job.status == 'Published')
      .map(job => {
        return {
          text: job.title,
          value: job.title
        }
      })

    let roles = require('../data/roles').map(item => {
      return { text: item, value: item }
    })

    let phases = require('../data/phases').map(item => {
      return { text: item, value: item }
    })

    res.render('jobseekers/index', {
      roles,
      phases,
      jobCheckboxes
    })
  })

  router.get('/jobseekers/:id', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    let workHistory = jobseeker.profile.workHistory.sort((a, b) => {
      let dateA = new Date(a.startDate);
      let dateB = new Date(b.startDate);
      return dateB - dateA;
    })

    let qualifications = jobseeker.profile.qualifications

    let qualificationsGroup = _.sortBy(qualifications, function(item) {
      return item.year
    }).reverse()

    qualificationsGroup = _.groupBy(qualificationsGroup, function(item){
      return item.type
    })

    _.forIn(qualificationsGroup, function(value, key, object) {
      // value = the array

      object[key] = _.groupBy(value, function(item) {
        return item.year + item.organisation
      })
    })


    res.render('jobseekers/show', {
      jobseeker,
      workHistory,
      qualificationsGroup
    })
  })

  router.get('/jobseekers/:id/invites/new', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    let jobCheckboxes = req.session.user.jobs
      .filter(job => job.status == 'Published')
      .map(item => {
        return {
          text: item.title,
          value: item.title,
          hint: {
            text: item.role
          }
        }
      })

    res.render('jobseekers/invites/new/index', {
      jobseeker,
      jobCheckboxes
    })
  })

  router.post('/jobseekers/:id/invites/new', authentication.checkIsAuthenticated, (req, res) => {
    req.flash('success', 'Invited to apply for a job')
    res.redirect(`/jobseekers/${req.params.id}`)
  })
}