
const authentication = require('../middleware/authenticaton')
const Validator = require('../helpers/validator')

module.exports = router => {

  router.get('/jobs/new', authentication.checkIsAuthenticated, (req, res) => {
    let org = req.session.user.organisation
    if(org.schools && org.schools.length > 1) {
      res.redirect('/jobs/new/locations')
    } else {
      res.redirect('/jobs/new/title')
    }
  })

  router.get('/jobs/new/locations', (req, res) => {
    let org = req.session.user.organisation

    let locationOptions = [{
      text: 'Head office',
      value: 'Head office',
      hint: {
        text: [org.address.address1, org.address.town, org.address.postcode].join(', ')
      },
      checked: req.session.data['createJob'] && req.session.data['createJob'].locations && req.session.data['createJob'].locations.find(location => location == 'Head office')
    }]

    let schoolOptions = req.session.user.organisation.schools.map(item => {
      return {
        text: item.name,
        value: item.name,
        hint: {
          text: [item.address.address1, item.address.town, item.address.postcode].join(', ')
        },
        checked: req.session.data['createJob'] && req.session.data['createJob'].locations && req.session.data['createJob'].locations.find(location => location == item.name)
      }
    })

    locationOptions = locationOptions.concat(schoolOptions)

    res.render('jobs/new/locations', {
      locationOptions
    })
  })

  router.get('/jobs/new/phase', (req, res) => {
    const options = [{
      value: 'Nursery',
      text: 'Nursery'
    }, {
      value: 'Primary school',
      text: 'Primary school'
    }, {
      value: 'Middle school',
      text: 'Middle school'
    }, {
      value: 'Secondary school',
      text: 'Secondary school'
    }, {
      value: 'Sixth form or college',
      text: 'Sixth form or college'
    }, {
      value: 'Through school',
      text: 'Through school'
    }]

    res.render('jobs/new/phase', {
      options
    })
  })

  router.get('/jobs/new/key-stage', (req, res) => {
    
    res.render('jobs/new/key-stage', {
      
    })
  })

  router.post('/jobs/new/role_all', (req, res) => {
    
      var whatRole = req.session.data['jobRole'];

      // Check whether the variable includes the string "england" or "scotland"
      if (whatRole && (whatRole.includes("Administration, HR data and finance") 
        || whatRole.includes("Catering, cleaning and site management") 
        || whatRole.includes("IT support")
        || whatRole.includes("Other support roles")
        || whatRole.includes("Pastoral, health and welfare")
        || whatRole.includes("Other leadership roles")
    )) {
        // Send user to the next page
          res.redirect('contract');
      } else {
          // Send user to the ineligible page
          res.redirect('key-stage');
      }

  });


  router.post('/jobs/new/key-stage', (req, res) => {
    
      var keyStages = req.session.data['createJob']['key-stages'];

      // Check whether the variable includes the string "england" or "scotland"
      if (keyStages && (keyStages.includes("Key stage 3") || keyStages.includes("Key stage 4") || keyStages.includes("Key stage 5"))) {
        // Send user to the next page
          res.redirect('subjects');
      } else {
          // Send user to the ineligible page
          res.redirect('contract');
      }

  });

  router.post('/jobs/new/method', (req, res) => {
    if(req.body['createJob'] && req.body['createJob'].method == 'Yes') {
      res.redirect('/jobs/new/school-visits')
    } else {
      res.redirect('/jobs/new/process')
    }
  })

  router.post('/jobs/new/process', (req, res) => {
    if(req.body['createJob'] && req.body['createJob'].process == 'By email') {
      res.redirect('/jobs/new/form')
    } else {
      res.redirect('/jobs/new/link')
    }
  })

  router.post('/jobs/new/upload', (req, res) => {
    if(req.body['createJob'] && req.body['createJob'].upload == 'Yes') {
      res.redirect('/jobs/new/file')
    } else {
      //res.redirect('/jobs/new/check')
      res.redirect('/jobs/new/check')
    }
  })

  router.post('/jobs/new/file-check', (req, res) => {
    if(req.body['createJob'] && req.body['createJob']['add-another-file'] == 'Yes') {
      res.redirect('/jobs/new/file')
    } else {
      res.redirect('/jobs/new/check')
    }
  })

  router.get('/jobs/new/sponsorship', (req, res) => {

    res.render('jobs/new/sponsorship', {
      
    })
  })


  router.post('/jobs/new/working-patterns', (req, res) => {
    const validator = new Validator(req, res);

    validator.add({
      name: 'createJob.workingPatterns',
      rules: [{
        fn: (value) => {
          let valid = true;
          if(value == '_unchecked') {
            valid = false;
          }
          return valid;
        },
        message: 'Select a working pattern'
      }]
    });

    if(req.body['createJob'].workingPatterns == 'Part time') {
      validator.add({
        name: 'createJob.partTimeDetails',
        rules: [{
          fn: (value) => {
            let valid = true;
            if(!value || value.trim().length == 0) {
              valid = false;
            }
            return valid;
          },
          message: 'Enter part time details'
        }]
      })
    }

    if(validator.validate()) {
      res.redirect('/jobs/new/salary')
    } else {
      res.render('jobs/new/working-patterns');
    }
  })

}