const users = require('../data/users.json')
const organisations = require('../data/orgs.json')

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

  router.post('/account/new', (req, res) => {
    res.locals.user = req.session.user = {
      username: req.body.emailAddress,
      password: req.body.password,
      organisation: organisations.find(org => org.name == 'Bushey Meads Secondary School')
    }
    res.redirect('/account/new/confirmation')
  })

}