
const authentication = require('../middleware/authenticaton')
const _ = require('lodash')

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
}