
const authentication = require('../middleware/authentication')
const { findById } = require('../helpers/lookup')

function jobseekerFromRequest (req) {
  return findById(req.session.user && req.session.user.jobseekers, req.params.id)
}

function jobFromRequest (req) {
  return findById(req.session.user && req.session.user.jobs, req.params.id)
}

const JOB_LISTS = {
  active: {
    status: 'Active',
    heading: 'Active jobs',
    empty: 'You currently have no active jobs.'
  },
  draft: {
    status: 'Draft',
    heading: 'Draft jobs',
    empty: 'You currently have no draft jobs.'
  },
  scheduled: {
    status: 'Scheduled',
    heading: 'Scheduled jobs',
    empty: 'You currently have no scheduled jobs.'
  },
  closed: {
    status: 'Closed',
    heading: 'Closed jobs',
    empty: 'You currently have no closed jobs.'
  },
  'awaiting-feedback': {
    status: 'Closed',
    heading: 'Jobs awaiting feedback',
    empty: 'You currently have no jobs awaiting feedback.'
  }
}

function renderJobList (listId) {
  return (req, res) => {
    const list = JOB_LISTS[listId]
    const jobs = (req.session.user.jobs || []).filter(job => job.status === list.status)

    res.render('jobs/index', {
      jobs,
      jobListId: listId,
      jobListEmpty: list.empty,
      title: `${list.heading} (${jobs.length})`
    })
  }
}

module.exports = router => {

  router.get('/jobs', authentication.checkIsAuthenticated, renderJobList('active'))
  router.get('/jobs/draft', authentication.checkIsAuthenticated, renderJobList('draft'))
  router.get('/jobs/scheduled', authentication.checkIsAuthenticated, renderJobList('scheduled'))
  router.get('/jobs/closed', authentication.checkIsAuthenticated, renderJobList('closed'))
  router.get('/jobs/awaiting-feedback', authentication.checkIsAuthenticated, renderJobList('awaiting-feedback'))

  router.get('/jobs/example', authentication.checkIsAuthenticated, (req, res) => {

    res.render('jobs/example', {
      
    })
  })

  router.get('/jobs/:id', authentication.checkIsAuthenticated, (req, res) => {
    const job = jobFromRequest(req)
    if (!job) {
      res.redirect('/jobs')
      return
    }

    res.render('jobs/show', {
      job
    })
  })

  router.get('/jobs/:id/statistics', authentication.checkIsAuthenticated, (req, res) => {
    const job = jobFromRequest(req)
    if (!job) {
      res.redirect('/jobs')
      return
    }

    res.render('jobs/statistics', {
      job
    })
  })

  router.get('/jobs/:id/activity', authentication.checkIsAuthenticated, (req, res) => {
    const job = jobFromRequest(req)
    if (!job) {
      res.redirect('/jobs')
      return
    }

    res.render('jobs/activity', {
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


  router.get('/jobs/:id/interview', authentication.checkIsAuthenticated, (req, res) => {
    const jobseeker = jobseekerFromRequest(req)
    if (!jobseeker) {
      res.redirect('/jobs')
      return
    }

    res.render('jobs/applications/interview_templates', {
      jobseeker
    })
  })

  router.get('/jobs/:id/interview_email', authentication.checkIsAuthenticated, (req, res) => {
    let job = req.session.user.jobs.find(job => job.id == req.params.id)
    let user = req.session.user

    res.render('jobs/applications/interview_customise', {
      job,
      user
    })
  })

  router.post('/jobs/:id/interview_email', (req, res) => {
    
    req.flash('success', 'Email template updated')
    
    res.redirect(`/jobs/${req.params.id}/interview`)
   
  })


  router.get('/jobs/:id/interview_check', authentication.checkIsAuthenticated, (req, res) => {
    const jobseeker = jobseekerFromRequest(req)
    if (!jobseeker) {
      res.redirect('/jobs')
      return
    }

    res.render('jobs/applications/interview_check', {
      jobseeker,
      user: req.session.user
    })
  })

  router.post('/jobs/:id/interview_check', authentication.checkIsAuthenticated, (req, res) => {
    const jobseeker = jobseekerFromRequest(req)
    if (!jobseeker) {
      res.redirect('/jobs')
      return
    }

    jobseeker.tag = 'Interviewing'
    req.flash('success', 'Emails sent')
    res.redirect(`/jobs/application/${jobseeker.id}`)
  })

  
  router.get('/jobs/application/:id', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    res.render('jobs/applications_example', {
      jobseeker
    })
  })

  router.get('/jobs/application/:id/checklist', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    res.render('jobs/applications_example_checklist', {
      jobseeker
    })
  })


  router.post('/jobs/application/:id', authentication.checkIsAuthenticated, (req, res) => {
    const jobseeker = jobseekerFromRequest(req)
    if (!jobseeker) {
      res.redirect('/jobs')
      return
    }

    jobseeker.tag = req.session.data && req.session.data.tag
    req.flash('success', 'Pre-employment checklist updated')
    res.redirect(`/jobs/application/${req.params.id}`)
  })

  //ADDING A MANUAL REFERENCE STUFF

   router.get('/jobs/application/:id/reference', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    res.render('jobs/applications_example_reference', {
      jobseeker
    })
  })

  router.post('/jobs/application/:id/reference', authentication.checkIsAuthenticated, (req, res) => {
    const jobseeker = jobseekerFromRequest(req)
    if (!jobseeker) {
      res.redirect('/jobs')
      return
    }

    jobseeker.tag = req.session.data && req.session.data.tag
    req.flash('success', 'New reference added')
    res.redirect(`/jobs/application/${req.params.id}`)
  })

  //ADDING A MANUAL REFERENCE STUFF

   router.get('/jobs/application/:id/reference_example', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    res.render('jobs/applications_example_reference_data', {
      jobseeker
    })
  })

  //REQUEST A REFERENCE BUTTON

  router.get('/jobs/application/:id/requestareference', authentication.checkIsAuthenticated, (req, res) => {
    const jobseeker = jobseekerFromRequest(req)
    if (!jobseeker) {
      res.redirect('/jobs')
      return
    }

    jobseeker.tag = req.session.data && req.session.data.tag
    req.flash('success', 'Request for a reference email sent')
    res.redirect(`/jobs/application/${req.params.id}`)
  })

  //online checks

   router.get('/jobs/application/:id/online_checks', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    res.render('jobs/applications_example_online_checks', {
      jobseeker
    })
  })

  router.post('/jobs/application/:id/online_checks', authentication.checkIsAuthenticated, (req, res) => {
    const jobseeker = jobseekerFromRequest(req)
    if (!jobseeker) {
      res.redirect('/jobs')
      return
    }

    jobseeker.tag = req.session.data && req.session.data.tag
    req.flash('success', 'Online checks updated')
    res.redirect(`/jobs/application/${req.params.id}`)
  })

  //reference upload journey

   router.get('/reference/upload', authentication.checkIsAuthenticated, (req, res) => {
    

    res.render('reference/upload', {
      
      
    })
  })

  //TAG STUFF


  router.get('/jobs/application/tag/:id', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    res.render('jobs/tag_single', {
      jobseeker
    })
  })

  router.post('/jobs/application/tag/:id', authentication.checkIsAuthenticated, (req, res) => {
    const jobseeker = jobseekerFromRequest(req)
    if (!jobseeker) {
      res.redirect('/jobs')
      return
    }

    jobseeker.tag = req.session.data && req.session.data.tag
    req.flash('success', 'Application status updated')
    res.redirect(`/jobs/application/${jobseeker.id}`)
  })

  router.post('/jobs/:id/tag', (req, res) => {
    
      req.flash('success', 'Application status updated')
      res.redirect('/jobs/686355/applications')
    
  })

  //FEEDBACK START

  router.get('/jobs/:id/feedback_templates', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    res.render('jobs/applications/templates', {
      jobseeker
    })
  })

  router.post('/jobs/:id/feedback', (req, res) => {

    req.flash('success', 'Email template updated')
    
    res.redirect(`/jobs/${req.params.id}/feedback_templates`)
   
  })

  router.get('/jobs/:id/feedback', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    res.render('jobs/applications/customise', {
      jobseeker
    })
  })

  router.post('/jobs/:id/feedback', (req, res) => {
    
    res.redirect(`/jobs/${req.params.id}/feedbackcheck`)
   
  })

  router.get('/jobs/:id/feedbackcheck', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    res.render('jobs/applications/check', {
      jobseeker
    })
  })

  router.post('/jobs/:id/feedbackcheck', (req, res) => {

    req.flash('success', 'Rejection emails sent')
    
    res.redirect(`/jobs/${req.params.id}`)
   
  })



  //multiple people tags

  router.get('/jobs/:id/tag', authentication.checkIsAuthenticated, (req, res) => {
    let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('jobs/tag', {
      job
    })
  })

  
  //END TAG

  //INTERVIEW DETAILS START

  router.get('/jobs/application/interview/:id', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    res.render('jobs/interview_single', {
      jobseeker
    })
  })

  router.post('/jobs/application/interview/:id', authentication.checkIsAuthenticated, (req, res) => {
    const jobseeker = jobseekerFromRequest(req)
    if (!jobseeker) {
      res.redirect('/jobs')
      return
    }

    jobseeker.interviewDetails = req.session.data && req.session.data.interviewDetails
    jobseeker.tag = 'Interviewing'

    req.flash('success', 'Interview details added')
    res.redirect(`/jobs/application/${jobseeker.id}`)
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