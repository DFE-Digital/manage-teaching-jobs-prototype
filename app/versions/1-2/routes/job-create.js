
const fs = require('fs')
const path = require('path')
const authentication = require('../middleware/authentication')
const Validator = require('../helpers/validator')
const { isCollegeFeCreateJob } = require('../lib/fe-parity')
const buildCreateJobCheckDisplay = require('../lib/create-job-check-display')
const buildCreateJobSubjectItems = require('../../../lib/build-create-job-subject-items')

function feAboutVariantFromQuery (query) {
  if (query.v3 !== undefined) return 3
  if (query.v2 !== undefined) return 2
  return 1
}

function renderCreateJobPage (view, req, res) {
  const locals = {
    hideAdditionalAllowances: isCollegeFeCreateJob(
      req.session.data || {},
      req.session.user
    )
  }
  if (view === 'jobs/new/about') {
    locals.feAboutVariant = feAboutVariantFromQuery(req.query || {})
  }
  res.render(view, locals)
}

module.exports = router => {

  router.get('/jobs/new/salary', authentication.checkIsAuthenticated, (req, res) => {
    renderCreateJobPage('jobs/new/salary', req, res)
  })

  router.get('/jobs/new/check', authentication.checkIsAuthenticated, (req, res) => {
    const sessionData = req.session.data || {}
    res.render('jobs/new/check', {
      data: buildCreateJobCheckDisplay(sessionData),
      hideAdditionalAllowances: isCollegeFeCreateJob(sessionData, req.session.user)
    })
  })

  router.get('/jobs/new', authentication.checkIsAuthenticated, (req, res) => {
    let org = req.session.user.organisation
    if(org.schools && org.schools.length > 1) {
      res.redirect('/jobs/new/locations')
    } else {
      res.redirect('/jobs/new/title')
    }
  })

  router.get('/jobs/new/start', authentication.checkIsAuthenticated, (req, res) => {
    renderCreateJobPage('jobs/new/start', req, res)
  })

  router.post('/jobs/new/start', (req, res) => {
    res.redirect('/jobs/new/title')
  })

  router.get('/jobs/new/title', authentication.checkIsAuthenticated, (req, res) => {
    renderCreateJobPage('jobs/new/title', req, res)
  })

  router.post('/jobs/new/title', (req, res) => {
    res.redirect('/jobs/new/role_all')
  })

  router.get('/jobs/new/role_all', authentication.checkIsAuthenticated, (req, res) => {
    renderCreateJobPage('jobs/new/role_all', req, res)
  })

  router.get('/jobs/new/locations', (req, res) => {
    const org = req.session.user.organisation
    const sessionData = req.session.data || {}
    const createJob = sessionData.createJob || sessionData['createJob']
    const savedLocations = createJob && createJob.locations

    let locationOptions = [{
      text: 'Head office',
      value: 'Head office',
      hint: {
        text: [org.address.address1, org.address.town, org.address.postcode].join(', ')
      },
      checked: savedLocations && savedLocations.find(location => location == 'Head office')
    }]

    let schoolOptions = (org.schools || []).map(item => {
      return {
        text: item.name,
        value: item.name,
        hint: {
          text: [item.address.address1, item.address.town, item.address.postcode].join(', ')
        },
        checked: savedLocations && savedLocations.find(location => location == item.name)
      }
    })

    locationOptions = locationOptions.concat(schoolOptions)

    res.render('jobs/new/locations', {
      locationOptions
    })
  })

  router.post('/jobs/new/phase', (req, res) => {
    res.redirect('/jobs/new/subjects')
  })

  router.post('/jobs/new/subjects', (req, res) => {
    res.redirect('/jobs/new/contract')
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

  router.get('/jobs/new/subjects', (req, res) => {
    const data = req.session.data || {}
    const showCollegeSubjectList = isCollegeFeCreateJob(data, req.session.user)
    res.render('jobs/new/subjects', {
      showCollegeSubjectList,
      subjectItems: buildCreateJobSubjectItems(data),
      hideAdditionalAllowances: showCollegeSubjectList
    })
  })

  router.get('/jobs/new/school-visits', (req, res) => {
    renderCreateJobPage('jobs/new/school-visits', req, res)
  })

  router.post('/jobs/new/school-visits', (req, res) => {
    const upload = req.body.createJob && req.body.createJob.upload
    if (upload !== undefined) {
      if (upload === 'Yes') {
        res.redirect('/jobs/new/file')
        return
      }
      res.redirect('/jobs/new/check')
      return
    }
    res.redirect('/jobs/new/sponsorship2')
  })

  router.get('/jobs/new/sponsorship2', (req, res) => {
    renderCreateJobPage('jobs/new/sponsorship2', req, res)
  })

  router.post('/jobs/new/sponsorship2', (req, res) => {
    res.redirect('/jobs/new/listing-dates')
  })

  router.get('/jobs/new/listing-dates', (req, res) => {
    renderCreateJobPage('jobs/new/listing-dates', req, res)
  })

  router.post('/jobs/new/listing-dates', (req, res) => {
    res.redirect('/jobs/new/application_method')
  })

  router.post('/jobs/new/form', (req, res) => {
    res.redirect('/jobs/new/school-visits')
  })

  router.post('/jobs/new/link', (req, res) => {
    res.redirect('/jobs/new/school-visits')
  })

  router.get('/jobs/new/contact-details', (req, res) => {
    renderCreateJobPage('jobs/new/contact-details', req, res)
  })

  router.post('/jobs/new/contact-details', (req, res) => {
    res.redirect('/jobs/new/check')
  })

  router.get('/jobs/new/anonymised', (req, res) => {
    renderCreateJobPage('jobs/new/anonymised', req, res)
  })

  router.post('/jobs/new/anonymised', (req, res) => {
    res.redirect('/jobs/new/contact-details')
  })

  router.get('/jobs/new/website', (req, res) => {
    renderCreateJobPage('jobs/new/website', req, res)
  })

  router.post('/jobs/new/website', (req, res) => {
    res.redirect('/jobs/new/contact-details')
  })

  router.post('/jobs/new/receive_applications', (req, res) => {
    res.redirect('/jobs/new/contact-details')
  })

  router.post('/jobs/new/role_all', (req, res) => {
    
      let org = req.session.user.organisation.name

      if (org == 'Hope college'){
        // Send user to the next page
        req.session.data.createJob ??= {};
        req.session.data.createJob.phase = 'further education or college';
        res.redirect('subjects');
      } else {
        res.redirect('phase');
      }

  });

  router.post('/jobs/new/role_type', (req, res) => {
    
      var whatRole = req.session.data['roleType'];

      if (whatRole == "Secondary school job"){
          res.redirect('phase');
      } else {
          res.redirect('subjects');
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
    if(req.session.data['signIn'] == 'Yes') {
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
    res.render('jobs/new/sponsorship')
  })


  router.get('/jobs/new/application_method', (req, res) => {
    renderCreateJobPage('jobs/new/application_method', req, res)
  })

  router.post('/jobs/new/application_method', (req, res) => {
    if(req.session.data['signIn'] == 'other') {
      res.redirect('/jobs/new/how')
    } else {
      res.redirect('/jobs/new/anonymised')
    }
  })

  router.post('/jobs/new/how', (req, res) => {
    if(req.session.data['how'] == 'By email') {
      res.redirect('/jobs/new/receive_applications')
    } else {
      res.redirect('/jobs/new/website')
    }
  })

  router.get('/jobs/new/receive_applications', (req, res) => {
    
    res.render('jobs/new/receive_applications', {
      
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

  const viewsRoot = path.join(__dirname, '../views')

  router.get(/^\/jobs\/new\/([^./]+)$/, authentication.checkIsAuthenticated, (req, res, next) => {
    const view = `jobs/new/${req.params[0]}`
    const viewFile = path.join(viewsRoot, `${view}.njk`)
    if (!fs.existsSync(viewFile)) {
      return next()
    }
    renderCreateJobPage(view, req, res)
  })

}