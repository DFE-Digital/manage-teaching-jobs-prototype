const authentication = require('../middleware/authentication')

module.exports = router => {
  router.get('/messages', authentication.checkIsAuthenticated, (req, res) => {
    res.render('messages/index', { messages: [], folder: 'inbox' })
  })

  router.get('/messages/archive', authentication.checkIsAuthenticated, (req, res) => {
    res.render('messages/index', { messages: [], folder: 'archive' })
  })

  router.get('/notifications', authentication.checkIsAuthenticated, (req, res) => {
    res.render('notifications/index')
  })

  function renderStatistics (tab) {
    return (req, res) => {
      const jobs = (req.session.user && req.session.user.jobs) || []
      res.render('statistics/index', {
        statsTab: tab,
        jobCount: jobs.length
      })
    }
  }

  router.get('/statistics', authentication.checkIsAuthenticated, renderStatistics('overview'))
  router.get('/statistics/equal-opportunities', authentication.checkIsAuthenticated, renderStatistics('equal-opportunities'))
}
