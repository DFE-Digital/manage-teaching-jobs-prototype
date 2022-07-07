const users = require('../data/users.json')

module.exports = router => {

  router.post('/sign-in', (req, res) => {
    res.locals.user = req.session.user = users[0]
    res.redirect('/jobs')
  })

  router.get('/sign-out', (req, res) => {
    res.locals.user = req.session.user = null
    res.redirect('/')
  })

  router.post('/create-account', (req, res) => {
    res.locals.user = req.session.user = {
      username: req.body.emailAddress,
      password: req.body.password
    }
    res.redirect('/create-account/confirmation')
  })

}