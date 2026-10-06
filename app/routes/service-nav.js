const authentication = require('../middleware/authentication')

module.exports = router => {
  router.get('/messages', authentication.checkIsAuthenticated, (req, res) => {
    const jobseekers = (req.session.user && req.session.user.jobseekers) || []
    const jobs = (req.session.user && req.session.user.jobs) || []
    const jobTitle = jobs[0] ? jobs[0].title : 'your vacancy'

    const messages = jobseekers.slice(0, 6).map((jobseeker, index) => {
      const subjects = [
        `Invitation to apply for ${jobTitle}`,
        `Update on your application for ${jobTitle}`,
        `Interview invitation for ${jobTitle}`
      ]
      const statuses = ['Sent', 'Sent', 'Opened']
      const dates = ['7 October 2026', '6 October 2026', '3 October 2026']

      return {
        name: [jobseeker.profile.firstName, jobseeker.profile.lastName].join(' '),
        email: jobseeker.emailAddress,
        href: `/jobseekers/${jobseeker.id}`,
        subject: subjects[index % subjects.length],
        status: statuses[index % statuses.length],
        sentOn: dates[index % dates.length]
      }
    })

    res.render('messages/index', { messages })
  })

  router.get('/notifications', authentication.checkIsAuthenticated, (req, res) => {
    const jobseekers = (req.session.user && req.session.user.jobseekers) || []
    const jobs = (req.session.user && req.session.user.jobs) || []
    const organisationName = req.session.user.organisation.name
    const firstCandidate = jobseekers[0]
    const firstJob = jobs[0]

    const notifications = []

    if (firstCandidate) {
      notifications.push({
        title: 'New candidate profile matches your school',
        body: `${firstCandidate.profile.firstName} ${firstCandidate.profile.lastName} is interested in working near ${organisationName}.`,
        href: `/jobseekers/${firstCandidate.id}`,
        receivedOn: 'Today'
      })
    }

    if (firstJob) {
      notifications.push({
        title: 'Your job listing is live',
        body: `${firstJob.title} is published and accepting applications.`,
        href: `/jobs/${firstJob.id}`,
        receivedOn: 'Yesterday'
      })
    }

    notifications.push({
      title: 'You can now view candidate profiles',
      body: 'You’ll be notified when new candidate profiles match your job listings.',
      href: '/jobseekers',
      receivedOn: '2 October 2026'
    })

    res.render('notifications/index', { notifications })
  })

  router.get('/statistics', authentication.checkIsAuthenticated, (req, res) => {
    const jobs = (req.session.user && req.session.user.jobs) || []

    const jobStats = jobs.map((job, index) => {
      const seed = Number(job.id) || (index + 1) * 17

      return {
        id: job.id,
        title: job.title,
        status: job.status,
        href: `/jobs/${job.id}/statistics`,
        views: 8 + (seed % 47),
        saves: 1 + (seed % 11),
        applications: seed % 18
      }
    })

    const totals = jobStats.reduce((acc, job) => {
      acc.views += job.views
      acc.saves += job.saves
      acc.applications += job.applications
      return acc
    }, { views: 0, saves: 0, applications: 0 })

    res.render('statistics/index', { jobStats, totals })
  })
}
