
const authentication = require('../middleware/authenticaton')
const organisationHelper = require('../helpers/organisation')

module.exports = router => {

  router.get('/organisation-incomplete', authentication.checkIsAuthenticated, (req, res) => {
    let missingInformation = organisationHelper.getMissingInformation(req.session.user.organisation)

    let attributeMap = {
      phase: 'education phase',
      about: 'information about your school',
      supportForEmployees: 'information about how your school supports employees',
      logo: 'logo',
      photo: 'photo'
    }


    missingInformation = missingInformation.map(item => attributeMap[item])




    res.render('organisation-incomplete/index', {
      missingInformation
    })
  })

}