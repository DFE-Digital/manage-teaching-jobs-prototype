
const authentication = require('../middleware/authenticaton')
const organisationHelper = require('../helpers/organisation')

module.exports = router => {

  router.get('/organisation', authentication.checkIsAuthenticated, (req, res) => {
    let user = req.session.user
    let showCompleteProfileBanner = organisationHelper.hasMissingInformation(user.organisation)
    let schools
    if(user.organisation.schools) {
      schools = user.organisation.schools.map(school => {
        school.missingInformation = organisationHelper.getMissingInformation(school)
        school.hasMissingInformation = school.missingInformation.length
        return school
      })
      .sort((a, b) => {
        return a.hasMissingInformation ? -1 : 1;
      })
    }

    res.render('organisation/index', {
      showCompleteProfileBanner,
      schools
    })
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
    let organisation = req.session.user.organisation
    let school = organisation.schools.find(school => school.id == req.params.id)
    let showCompleteProfileBanner = organisationHelper.hasMissingInformation(organisation).length

    res.render('organisation/schools/show', {
      school,
      showCompleteProfileBanner
    })
  })

}