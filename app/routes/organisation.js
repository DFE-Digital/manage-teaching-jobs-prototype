
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
    let userOrganisation = req.session.user.organisation
    let organisation
    // If the user is trying to preview a school within a MAT
    if(userOrganisation.id != req.params.id) {
      organisation = userOrganisation.schools.find(school => school.id == req.params.id)
      organisation.parentOrganisation = {
        name: userOrganisation.name,
        id: userOrganisation.id
      }
    } else {
      organisation = userOrganisation
    }

    let jobs = req.session.user.jobs.filter(job => job.status == 'Active')

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

  //////////////
  // EMAIL STUFF
  //////////////

  router.get('/organisation/:id/email/edit', authentication.checkIsAuthenticated, (req, res) => {
    let userOrganisation = req.session.user.organisation
    let organisation
    // If the user is trying to preview a school within a MAT
    if(userOrganisation.id != req.params.id) {
      organisation = userOrganisation.schools.find(school => school.id == req.params.id)
      organisation.parentOrganisation = {
        name: userOrganisation.name,
        id: userOrganisation.id
      }
    } else {
      organisation = userOrganisation
    }

    res.render('organisation/edit-email/index', {
      organisation
    })

  })

  router.post('/organisation/:id/email/edit', authentication.checkIsAuthenticated, (req, res) => {
    let user = req.session.user

    let organisation = user.organisation

    let isEditingSchoolWithinOrganisation = organisation.id !== req.params.id

    if(isEditingSchoolWithinOrganisation) {
      organisation = organisation.schools.find(school => school.id == req.params.id)
    }

    organisation.emailAddress = req.session.data.emailAddress

    if(isEditingSchoolWithinOrganisation) {
      req.flash('success', 'School email address updated')
      res.redirect(`/organisation/schools/${req.params.id}`)
    } else {
      if(organisation.schools) {
        req.flash('success', 'Organisation email address updated')
      } else {
        req.flash('success', 'School email address updated')
      }
      res.redirect('/organisation')
    }


  })

  //edit email

  router.get('/organisation/:id/email/check', authentication.checkIsAuthenticated, (req, res) => {
    let organisation = req.session.user.organisation

    res.render('organisation/edit-email/check', {
      organisation
    })
  })

  //resend email

  router.get('/organisation/:id/email/resend', authentication.checkIsAuthenticated, (req, res) => {
    let organisation = req.session.user.organisation

    res.render('organisation/edit-email/resend', {
      organisation
    })
  })

  //example email

  router.get('/organisation/:id/email/inbox', authentication.checkIsAuthenticated, (req, res) => {
    let organisation = req.session.user.organisation

    res.render('organisation/edit-email/inbox', {
      organisation
    })
  })

  //confirm email

  router.get('/organisation/:id/email/confirmation', authentication.checkIsAuthenticated, (req, res) => {
    let organisation = req.session.user.organisation

    res.render('organisation/edit-email/confirm', {
      organisation
    })
  })

  router.post('/organisation/:id/email/confirmation', authentication.checkIsAuthenticated, (req, res) => {

    let user = req.session.user
    let organisation = user.organisation
    let isEditingSchoolWithinOrganisation = organisation.id !== req.params.id

    if(isEditingSchoolWithinOrganisation) {
      organisation = organisation.schools.find(school => school.id == req.params.id)
    }

    organisation.emailAddress = req.session.data.emailAddress

    if(isEditingSchoolWithinOrganisation) {
      req.flash('success', 'School email updated')
      res.redirect(`/organisation/schools/${req.params.id}`)
    } else {
      if(organisation.schools) {
        req.flash('success', 'Organisation email updated')
      } else {
        req.flash('success', 'School email updated')
      }
      res.redirect('/organisation')
    }

  })

  //////////////
  // WEBSITE STUFF
  //////////////

  //edit website

  router.get('/organisation/:id/website/edit', authentication.checkIsAuthenticated, (req, res) => {
    let organisation = req.session.user.organisation

    res.render('organisation/edit-website/index', {
      organisation
    })
  })

  router.post('/organisation/:id/website/edit', authentication.checkIsAuthenticated, (req, res) => {

    let user = req.session.user
    let organisation = user.organisation
    let isEditingSchoolWithinOrganisation = organisation.id !== req.params.id

    if(isEditingSchoolWithinOrganisation) {
      organisation = organisation.schools.find(school => school.id == req.params.id)
    }

    organisation.website = req.session.data.website

    if(isEditingSchoolWithinOrganisation) {
      req.flash('success', 'School website updated')
      res.redirect(`/organisation/schools/${req.params.id}`)
    } else {
      if(organisation.schools) {
        req.flash('success', 'Organisation website updated')
      } else {
        req.flash('success', 'School website updated')
      }
      res.redirect('/organisation')
    }

  })

  //////////////
  // DESCRIPTION STUFF
  //////////////

  //edit website

  router.get('/organisation/:id/about/edit', authentication.checkIsAuthenticated, (req, res) => {
    let organisation = req.session.user.organisation

    res.render('organisation/edit-about/index', {
      organisation
    })
  })

  router.post('/organisation/:id/about/edit', authentication.checkIsAuthenticated, (req, res) => {

    let user = req.session.user
    let organisation = user.organisation
    let isEditingSchoolWithinOrganisation = organisation.id !== req.params.id

    if(isEditingSchoolWithinOrganisation) {
      organisation = organisation.schools.find(school => school.id == req.params.id)
    }

    organisation.about = req.session.data.about

    if(isEditingSchoolWithinOrganisation) {
      req.flash('success', 'School description updated')
      res.redirect(`/organisation/schools/${req.params.id}`)
    } else {
      if(organisation.schools) {
        req.flash('success', 'Organisation description updated')
      } else {
        req.flash('success', 'School description updated')
      }
      res.redirect('/organisation')
    }

  })


  //////////////
  // LOGO STUFF
  //////////////


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
    let user = req.session.user

    let organisation = user.organisation

    let isEditingSchoolWithinOrganisation = organisation.id !== req.params.id

    if(isEditingSchoolWithinOrganisation) {
      organisation = organisation.schools.find(school => school.id == req.params.id)
    }

    organisation.logo = req.session.data.logo


    if(isEditingSchoolWithinOrganisation) {
      req.flash('success', 'School logo updated')
      res.redirect(`/organisation/schools/${req.params.id}`)
    } else {
      if(organisation.schools) {
        req.flash('success', 'Organisation logo updated')
      } else {
        req.flash('success', 'School logo updated')
      }
      res.redirect('/organisation')
    }


  })

  //end logo

  //////////////
  // PHOTO STUFF
  //////////////


  router.get('/organisation/:id/photo/edit', authentication.checkIsAuthenticated, (req, res) => {
    res.render('organisation/edit-photo/index')
  })

  router.post('/organisation/:id/photo/edit', authentication.checkIsAuthenticated, (req, res) => {
    req.session.data.photo = '/public/images/photos/courtland_outside.jpg'
    res.redirect(`/organisation/${req.params.id}/photo/edit/check`)
  })

  router.get('/organisation/:id/photo/edit/check', authentication.checkIsAuthenticated, (req, res) => {
    res.render('organisation/edit-photo/check')
  })

  router.post('/organisation/:id/photo/edit/check', authentication.checkIsAuthenticated, (req, res) => {
    let user = req.session.user

    let organisation = user.organisation

    let isEditingSchoolWithinOrganisation = organisation.id !== req.params.id

    if(isEditingSchoolWithinOrganisation) {
      organisation = organisation.schools.find(school => school.id == req.params.id)
    }

    organisation.photo = req.session.data.photo

    if(isEditingSchoolWithinOrganisation) {
      req.flash('success', 'School photo updated')
      res.redirect(`/organisation/schools/${req.params.id}`)
    } else {
      if(organisation.schools) {
        req.flash('success', 'Organisation photo updated')
      } else {
        req.flash('success', 'School photo updated')
      }
      res.redirect('/organisation')
    }


  })

  //end photo

  router.get('/organisation/schools/:id', authentication.checkIsAuthenticated, (req, res) => {
    let organisation = req.session.user.organisation.schools.find(school => school.id == req.params.id)
    let showCompleteProfileBanner = organisationHelper.hasMissingInformation(organisation)

    res.render('organisation/schools/show', {
      organisation,
      showCompleteProfileBanner
    })
  })


}
