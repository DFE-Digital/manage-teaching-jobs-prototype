
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

    res.render('organisation/show', {
      showCompleteProfileBanner,
      organisation: user.organisation,
      schools
    })
  })

  router.get('/organisation/:id/preview', authentication.checkIsAuthenticated, (req, res) => {
    let organisation = req.session.user.organisation

    if(organisation.id != req.params.id) {
      organisation = organisation.schools.find(school => school.id == req.params.id)
    }

    let jobs = req.session.user.jobs.filter(job => job.status == 'Published')

    res.render('organisation/preview/index', {
      organisation,
      jobs
    })
  })

  router.get('/organisation/:id/preview/schools', authentication.checkIsAuthenticated, (req, res) => {
    let organisation = req.session.user.organisation

    res.render('organisation/preview/schools', {
      organisation
    })
  })

  router.get('/organisation/:id/logo/edit', authentication.checkIsAuthenticated, (req, res) => {
    res.render('organisation/edit-logo/index')
  })

  router.post('/organisation/:id/logo/edit', authentication.checkIsAuthenticated, (req, res) => {
    req.session.data.logo = '/public/images/logos/courtland.png'
    res.redirect(`/organisation/${req.params.id}/logo/edit/check`)
  })

  router.get('/organisation/:id/logo/edit/check', authentication.checkIsAuthenticated, (req, res) => {
    res.render('organisation/edit-logo/check')
  })

  router.post('/organisation/:id/logo/edit/check', authentication.checkIsAuthenticated, (req, res) => {
    req.session.user.organisation.logo = req.session.data.logo
    res.redirect('/organisation')
  })

  router.get('/organisation/schools/:id', authentication.checkIsAuthenticated, (req, res) => {
    let organisation = req.session.user.organisation.schools.find(school => school.id == req.params.id)
    let showCompleteProfileBanner = organisationHelper.hasMissingInformation(organisation).length

    res.render('organisation/show', {
      organisation,
      showBreadCrumb: true,
      showCompleteProfileBanner
    })
  })

}