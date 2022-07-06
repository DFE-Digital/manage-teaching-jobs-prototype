
const authentication = require('../middleware/authenticaton')

module.exports = router => {

  router.get('/jobs/new/schools', authentication.checkIsAuthenticated, (req, res) => {
    if(req.session.passport.user.organisation.locations.length < 2) {
      res.redirect('/jobs/new/role')
    } else {
      let locationCheckboxes = req.session.passport.user.organisation.locations.map(item => {
        return {
          text: item.name,
          value: item.name,
          hint: {
            text: [item.address.address1, item.address.town, item.address.postcode].join(', ')
          },
          checked: req.session.data['create-job'] && req.session.data['create-job'].locations && req.session.data['create-job'].locations.find(location => location == item.name)
        }
      })

      res.render('jobs/new/schools', {
        locationCheckboxes
      })
    }
  })

  router.get('/jobs/new/age-groups', authentication.checkIsAuthenticated, (req, res) => {
    const options = [{
      value: 'Primary',
      text: 'Primary'
    }, {
      value: 'Secondary',
      text: 'Secondary'
    }, {
      value: '16 to 19',
      text: '16 to 19'
    }, {
      value: 'Multiple age groups',
      text: 'Multiple age groups'
    }]

    res.render('jobs/new/age-groups', {
      options
    })
  })

  router.post('/jobs/new/method', (req, res) => {
    if(req.body['create-job'] && req.body['create-job'].method == 'Yes') {
      res.redirect('/jobs/new/school-visits')
    } else {
      res.redirect('/jobs/new/process')
    }
  })

  router.post('/jobs/new/process', (req, res) => {
    if(req.body['create-job'] && req.body['create-job'].process == 'By email') {
      res.redirect('/jobs/new/form')
    } else {
      res.redirect('/jobs/new/link')
    }
  })

  router.post('/jobs/new/upload', (req, res) => {
    if(req.body['create-job'] && req.body['create-job'].upload == 'Yes') {
      res.redirect('/jobs/new/file')
    } else {
      res.redirect('/jobs/new/check')
    }
  })

  // router.post('/jobs/new/school-visits', (req, res) => {
  //   if(req.body['create-job'] && req.body['create-job']['school-visits'] == 'Yes') {
  //     res.redirect('/jobs/new/school-visits-email-address')
  //   } else {
  //     res.redirect('/jobs/new/email-address')
  //   }
  // })

  router.post('/jobs/new/file-check', (req, res) => {
    if(req.body['create-job'] && req.body['create-job']['add-another-file'] == 'Yes') {
      res.redirect('/jobs/new/file')
    } else {
      res.redirect('/jobs/new/check')
    }
  })

}