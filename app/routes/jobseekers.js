
const authentication = require('../middleware/authenticaton')
const _ = require('lodash')
const { use } = require('browser-sync')

function isQTSRelevant(jobseeker) {
  let relevant = false
  if(jobseeker.profile.roles && (jobseeker.profile.roles.includes('Teacher') || 
    jobseeker.profile.roles.includes('Head of year or phase')|| 
    jobseeker.profile.roles.includes('Head of department or curriculum') || 
    jobseeker.profile.roles.includes('Assistant headteacher') || 
    jobseeker.profile.roles.includes('Deputy headteacher') || 
    jobseeker.profile.roles.includes('Headteacher') )) 
  {
    relevant = true
  }
  return relevant
}

module.exports = router => {

  router.get('/jobseeker-clear', function (req, res) {
      
      delete req.session.data.filters-rightToWork
      delete req.session.data.filters-qts
      delete req.session.data.filters-role
      delete req.session.data.filters-workingPatterns
      delete req.session.data.filters-keyStages
      delete req.session.data.filters-subjects

      res.redirect('/jobseekers')
  })


  router.get('/jobseekers', authentication.checkIsAuthenticated, (req, res) => {
    let user = req.session.user

    let locationCheckboxes


    if(user.organisation.schools) {
      locationCheckboxes = [{
        text: 'Head office',
        value: 'Head office'
      }].concat(user.organisation.schools.map(item => {
        return {
          text: item.name,
          value: item.name
        }
      }))
    }

    let jobCheckboxes = user.jobs
    .filter(job => job.status == 'Active')
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

    let showSubjectsFilter = false

    let phasesThatAreRelevantToSubjectFilter = [
      'Secondary school',
      'Middle school',
      'Sixth form or college',
      'Through school'
    ]

    if(user.organisation.phase && phasesThatAreRelevantToSubjectFilter.includes(user.organisation.phase)) {
      showSubjectsFilter = true
    }

    if(user.organisation.schools) {
      if(user.organisation.schools.filter(school => phasesThatAreRelevantToSubjectFilter.includes(school.phase)).length) {
        showSubjectsFilter = true
      }
    }

    let jobseekers = user.jobseekers.map(jobseeker => {
      jobseeker.showQTS = isQTSRelevant(jobseeker)
      return jobseeker
    })

    res.render('jobseekers/index', {
      jobseekers,
      locationCheckboxes,
      jobCheckboxes,
      roles,
      phases,
      showSubjectsFilter
    })
  })

  router.get('/jobshare', authentication.checkIsAuthenticated, (req, res) => {
    
    res.render('jobseekers/jobshare/jobshare_role', {
    
    })
  })

  router.get('/jobshare/days', authentication.checkIsAuthenticated, (req, res) => {
    
    res.render('jobseekers/jobshare/jobshare_days', {
    
    })
  })

  router.get('/jobseekers_noresults', authentication.checkIsAuthenticated, (req, res) => {

    res.render('jobseekers/no_results', {
      
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

    let showQTS = isQTSRelevant(jobseeker)

    res.render('jobseekers/show', {
      showQTS,
      jobseeker,
      workHistory,
      qualificationsGroup
    })
  })

  router.get('/jobseekers/:id/invites', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    res.render('jobseekers/invites/index', {
      jobseeker
    })
  })

  router.get('/jobseekers/:id/invites/new', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    let publishedJobs = req.session.user.jobs.filter(job => job.status == 'Active')

    let jobCheckboxes = publishedJobs.map(item => {
      return {
        text: item.title,
        value: item.title,
        hint: {
          text: item.role
        }
      }
    })

    // Adding an extra value outside of the map
    jobCheckboxes.push({
      divider: "or"
    });

    jobCheckboxes.push({
      text: 'None, send a custom message',
      value: 'general',
      behaviour: "exclusive"
    });

    res.render('jobseekers/invites/new/index', {
      jobseeker,
      publishedJobs,
      jobCheckboxes
    })
  })

  router.post('/jobseekers/:id/invites/new', authentication.checkIsAuthenticated, (req, res) => {

    //check if general option is selectred

    if(req.body['invite'] && req.body['invite'].jobs == 'general') {
      res.redirect(`/jobseekers/${req.params.id}/invites/new/customise-general`)
    } else {
      res.redirect(`/jobseekers/${req.params.id}/invites/new/customise`)
    }

  })

  router.get('/jobseekers/:id/invites/new/check', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    res.render('jobseekers/invites/new/check', {
      jobseeker
    })
  })

  router.post('/jobseekers/:id/invites/new/check', authentication.checkIsAuthenticated, (req, res) => {

    req.flash('success', 'Email sent to candidate')
    res.redirect(`/jobseekers/${req.params.id}`)
  })

  //customise message
  router.get('/jobseekers/:id/invites/new/customise', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    res.render('jobseekers/invites/new/customise', {
      jobseeker
    })
  })

  router.post('/jobseekers/:id/invites/new/customise', authentication.checkIsAuthenticated, (req, res) => {
    res.redirect(`/jobseekers/${req.params.id}/invites/new/check`)
  })

  //customise message general
  router.get('/jobseekers/:id/invites/new/customise-general', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    res.render('jobseekers/invites/new/customise-general', {
      jobseeker
    })
  })

  router.post('/jobseekers/:id/invites/new/customise-general', authentication.checkIsAuthenticated, (req, res) => {

    req.session.data['invite-jobs'] == 'general'

    res.redirect(`/jobseekers/${req.params.id}/invites/new/check`)
  })

  
  router.get('/search', authentication.checkIsAuthenticated, (req, res) => {
    let user = req.session.user

    let locationCheckboxes


    if(user.organisation.schools) {
      locationCheckboxes = [{
        text: 'Head office',
        value: 'Head office'
      }].concat(user.organisation.schools.map(item => {
        return {
          text: item.name,
          value: item.name
        }
      }))
    }

    let jobCheckboxes = user.jobs
    .filter(job => job.status == 'Active')
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

    let showSubjectsFilter = false

    let phasesThatAreRelevantToSubjectFilter = [
      'Secondary school',
      'Middle school',
      'Sixth form or college',
      'Through school'
    ]

    if(user.organisation.phase && phasesThatAreRelevantToSubjectFilter.includes(user.organisation.phase)) {
      showSubjectsFilter = true
    }

    if(user.organisation.schools) {
      if(user.organisation.schools.filter(school => phasesThatAreRelevantToSubjectFilter.includes(school.phase)).length) {
        showSubjectsFilter = true
      }
    }

    let jobseekers = user.jobseekers.map(jobseeker => {
      jobseeker.showQTS = isQTSRelevant(jobseeker)
      return jobseeker
    })

    res.render('jobseekers/search', {
      jobseekers,
      locationCheckboxes,
      jobCheckboxes,
      roles,
      phases,
      showSubjectsFilter
    })
  })



}