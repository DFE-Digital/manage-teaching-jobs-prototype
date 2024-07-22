
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


  router.get('/jobs/:id/interview', authentication.checkIsAuthenticated, (req, res) => {
    let job = req.session.user.jobs.find(job => job.id == req.params.id)

    res.render('jobs/applications/interview_templates', {
      job
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
    let job = req.session.user.jobs.find(job => job.id == req.params.id)
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)
    let user = req.session.user

    res.render('jobs/applications/interview_check', {
      job,
      jobseeker,
      user
    })
  })

  
  router.get('/jobs/application/:id', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    res.render('jobs/applications_example', {
      jobseeker
    })
  })


  //TAG STUFF


  router.get('/jobs/application/tag/:id', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    res.render('jobs/tag_single', {
      jobseeker
    })
  })

  router.post('/jobs/application/tag/:id', (req, res) => {
    
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    if (req.session.data.tag == 'Interviewing'){
      
      res.redirect(`/jobs/${req.params.id}/interview`)

    }else{

      jobseeker.tag = req.session.data.tag      
      req.flash('success', 'Application status updated')
      res.redirect(`/jobs/${req.params.id}/applications`)


    }

   
    
  })

  //FEEDBACK START

  router.get('/jobs/:id/feedback_templates', authentication.checkIsAuthenticated, (req, res) => {
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    res.render('jobs/applications/templates', {
      jobseeker
    })
  })

  router.post('/jobs/:id/feedback', (req, res) => {
    
    res.redirect(`/jobs/${req.params.id}/feedbackcheck`)
   
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

  router.post('/jobs/application/interview/:id', (req, res) => {
    
    let jobseeker = req.session.user.jobseekers.find(jobseeker => jobseeker.id == req.params.id)

    jobseeker.interviewDetails = req.session.data.interviewDetails
    jobseeker.tag = 'Interviewing'

    req.flash('success', 'Interview details added')
    res.redirect(`/jobs/${req.params.id}/applications`)

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