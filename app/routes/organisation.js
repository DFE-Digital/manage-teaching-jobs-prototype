
const authentication = require('../middleware/authenticaton')

module.exports = router => {

  router.get('/organisation', authentication.checkIsAuthenticated, (req, res) => {
    res.render('organisation/index')
  })

  router.post('/organisation/edit-logo', authentication.checkIsAuthenticated, (req, res) => {
    req.session.data.logo = '/public/images/logos/courtland.png'
    res.redirect('/organisation/edit-logo/check')
  })

  router.post('/organisation/edit-logo/check', authentication.checkIsAuthenticated, (req, res) => {
    req.session.user.organisation.logo = req.session.data.logo
    res.redirect('/organisation')
  })

  router.get('/schools/:id', authentication.checkIsAuthenticated, (req, res) => {
    let school = req.session.user.organisation.schools.find(school => school.id == req.params.id)
    res.render('organisation/schools/show', {
      school
    })
  })

}