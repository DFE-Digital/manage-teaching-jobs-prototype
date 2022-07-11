const users = require('../data/users.json')

module.exports = router => {

  router.get('/sign-in', (req, res) => {
    var options = users.map(user => {
      return {
        text: user.username,
        value: user.username,
        hint: {
          text: user.organisation.schoolType || user.organisation.trustType
        }
      }
    })
    res.render('sign-in', {
      options
    })
  })

  router.post('/sign-in', (req, res) => {
    if(req.body.emailAddress) {
      res.locals.user = req.session.user = users.find(user => user.username == req.body.emailAddress)
    } else {
      res.locals.user = req.session.user = users[0]
    }

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