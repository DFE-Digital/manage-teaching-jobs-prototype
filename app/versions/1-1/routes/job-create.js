
const authentication = require('../middleware/authentication')
const Validator = require('../helpers/validator')
const { isCollegeFeCreateJob } = require('../lib/fe-parity')
const buildCreateJobCheckDisplay = require('../lib/create-job-check-display')
const buildCreateJobSectionSummary = buildCreateJobCheckDisplay.buildCreateJobSectionSummary
const createJobTaskProgress = require('../lib/create-job-task-progress')
const createJobRoleRouting = require('../lib/create-job-role-routing')
const buildCreateJobSubjectItems = require('../../../lib/build-create-job-subject-items')

const CREATE_JOB_TASK_BY_PATH = {
  '/jobs/new/locations': 'job-location',
  '/jobs/new/title': 'job-title',
  '/jobs/new/title_auto': 'job-title',
  '/jobs/new/role_all': 'job-role-phase-subjects',
  '/jobs/new/role_type': 'job-role-phase-subjects',
  '/jobs/new/role': 'job-role-phase-subjects',
  '/jobs/new/role_teaching': 'job-role-phase-subjects',
  '/jobs/new/role_non_teaching': 'job-role-phase-subjects',
  '/jobs/new/phase': 'job-role-phase-subjects',
  '/jobs/new/subjects': 'job-role-phase-subjects',
  '/jobs/new/key-stage': 'job-role-phase-subjects',
  '/jobs/new/key-stage2': 'job-role-phase-subjects',
  '/jobs/new/contract': 'contract-working-pattern',
  '/jobs/new/working-patterns': 'contract-working-pattern',
  '/jobs/new/salary': 'salary',
  '/jobs/new/start-date': 'job-start-date',
  '/jobs/new/about': 'about-the-role',
  '/jobs/new/religious_questions': 'about-the-role',
  '/jobs/new/upload': 'about-the-role',
  '/jobs/new/file': 'about-the-role',
  '/jobs/new/file-check': 'about-the-role',
  '/jobs/new/sponsorship': 'visa-sponsorship',
  '/jobs/new/school-visits': 'school-visits',
  '/jobs/new/school-visits-email-address': 'school-visits',
  '/jobs/new/sponsorship2': 'visa-sponsorship',
  '/jobs/new/listing-dates': 'listing-dates',
  '/jobs/new/application_method': 'application-method',
  '/jobs/new/how': 'application-method',
  '/jobs/new/process': 'application-method',
  '/jobs/new/method': 'application-method',
  '/jobs/new/method_old': 'application-method',
  '/jobs/new/method_faith': 'application-method',
  '/jobs/new/method_catholic': 'application-method',
  '/jobs/new/anonymised': 'application-method',
  '/jobs/new/website': 'application-method',
  '/jobs/new/receive_applications': 'application-method',
  '/jobs/new/form': 'application-method',
  '/jobs/new/link': 'application-method',
  '/jobs/new/contact-details': 'contact-details',
  '/jobs/new/email-address': 'contact-details',
  '/jobs/new/phone': 'contact-details',
  '/jobs/new/check': 'check-and-publish'
}

function finishCreateJobSection (req, res, sectionKey, options) {
  createJobTaskProgress.completeSection(req, sectionKey, options)
  req.flash('success', createJobTaskProgress.sectionSavedMessage(sectionKey))
  res.redirect('/jobs/new/start')
}

function continueCreateJobTask (req, res, taskId, nextPath) {
  if (taskId && req.session.data) {
    createJobTaskProgress.markCompleted(req.session.data, [taskId])
  }
  res.redirect(nextPath)
}

const SECTION_SUMMARY_KEYS = [
  'job-details',
  'pay-and-contract',
  'about-the-role',
  'applications-and-publish'
]

function goToSectionSummary (req, res, sectionKey, taskId) {
  if (!SECTION_SUMMARY_KEYS.includes(sectionKey)) {
    return res.redirect('/jobs/new/start')
  }
  if (taskId && req.session.data) {
    createJobTaskProgress.markCompleted(req.session.data, [taskId])
  }
  res.redirect(`/jobs/new/section-summary/${sectionKey}`)
}

function renderSectionSummary (sectionKey, req, res) {
  if (!SECTION_SUMMARY_KEYS.includes(sectionKey)) {
    return res.redirect('/jobs/new/start')
  }
  const sessionData = req.session.data || {}
  res.render('jobs/new/section-summary', {
    sectionKey,
    data: buildCreateJobSectionSummary(sessionData),
    hideAdditionalAllowances: isCollegeFeCreateJob(sessionData, req.session.user)
  })
}

function renderCreateJobPage (view, req, res) {
  res.render(view, {
    hideAdditionalAllowances: isCollegeFeCreateJob(
      req.session.data || {},
      req.session.user
    )
  })
}

module.exports = router => {

  router.use('/jobs/new', (req, res, next) => {
    const isSaveLater = (req.method === 'POST' && req.body.saveAndFinishLater) ||
      (req.method === 'GET' && req.query.saveAndFinishLater)

    if (isSaveLater) {
      const taskId = CREATE_JOB_TASK_BY_PATH[req.path]
      if (req.session.data && taskId) {
        createJobTaskProgress.markSectionInProgressFromTask(
          req.session.data,
          taskId,
          req.session.user
        )
      }
      req.flash('success', createJobTaskProgress.PROGRESS_SAVED_MESSAGE)
      return res.redirect('/jobs/new/start')
    }

    if (req.method === 'GET') {
      const taskId = CREATE_JOB_TASK_BY_PATH[req.path]
      const sessionData = req.session.data
      if (taskId && sessionData) {
        if (
          taskId === 'check-and-publish' &&
          !createJobTaskProgress.canStartCheckAndPublish(sessionData, req.session.user)
        ) {
          return next()
        }
        createJobTaskProgress.markInProgress(sessionData, taskId)
      }
    }
    next()
  })

  router.get('/jobs/new/salary', authentication.checkIsAuthenticated, (req, res) => {
    renderCreateJobPage('jobs/new/salary', req, res)
  })

  router.get('/jobs/new/check', authentication.checkIsAuthenticated, (req, res) => {
    const sessionData = req.session.data || {}
    if (!createJobTaskProgress.canStartCheckAndPublish(sessionData, req.session.user)) {
      return res.redirect('/jobs/new/start')
    }
    res.render('jobs/new/check', {
      data: buildCreateJobCheckDisplay(sessionData),
      hideAdditionalAllowances: isCollegeFeCreateJob(sessionData, req.session.user)
    })
  })

  router.get('/jobs/new', authentication.checkIsAuthenticated, (req, res) => {
    res.redirect('/jobs/new/start')
  })

  router.get('/jobs/new/start', authentication.checkIsAuthenticated, (req, res) => {
    renderCreateJobPage('jobs/new/start', req, res)
  })

  router.get('/jobs/new/abandon', authentication.checkIsAuthenticated, (req, res) => {
    renderCreateJobPage('jobs/new/abandon', req, res)
  })

  router.post('/jobs/new/abandon', authentication.checkIsAuthenticated, (req, res) => {
    const data = req.session.data || {}
    ;[
      'createJob',
      'createJobTaskProgress',
      'createJobListingPublished',
      'job-title',
      'jobRole',
      'subjects',
      'how',
      'website',
      'signIn',
      'moreDetail',
      'job-share',
      'working-patterns',
      'religion-question',
      'createJob-sponsorship',
      'roleType'
    ].forEach(key => {
      delete data[key]
    })
    renderCreateJobPage('jobs/new/abandoned', req, res)
  })

  router.get('/jobs/new/section-summary/:sectionKey', authentication.checkIsAuthenticated, (req, res) => {
    renderSectionSummary(req.params.sectionKey, req, res)
  })

  router.post('/jobs/new/section-summary/:sectionKey', authentication.checkIsAuthenticated, (req, res) => {
    const { sectionKey } = req.params
    if (!SECTION_SUMMARY_KEYS.includes(sectionKey)) {
      return res.redirect('/jobs/new/start')
    }
    finishCreateJobSection(req, res, sectionKey)
  })

  router.get('/jobs/new/confirmation', authentication.checkIsAuthenticated, (req, res) => {
    renderCreateJobPage('jobs/new/confirmation', req, res)
  })

  router.post('/jobs/new/locations', (req, res) => {
    continueCreateJobTask(req, res, 'job-location', '/jobs/new/title')
  })

  router.post('/jobs/new/title', (req, res) => {
    continueCreateJobTask(req, res, 'job-title', '/jobs/new/role_all')
  })

  router.post('/jobs/new/contract', (req, res) => {
    continueCreateJobTask(req, res, 'contract-working-pattern', '/jobs/new/salary')
  })

  router.post('/jobs/new/salary', authentication.checkIsAuthenticated, (req, res) => {
    continueCreateJobTask(req, res, 'salary', '/jobs/new/start-date')
  })

  router.post('/jobs/new/about', (req, res) => {
    continueCreateJobTask(req, res, 'about-the-role', '/jobs/new/school-visits')
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
    const data = req.session.data || {}
  const next = createJobRoleRouting.nextStepAfterPhase(data)
  if (next === 'section-summary') {
    goToSectionSummary(req, res, 'job-details', 'job-role-phase-subjects')
    return
  }
  if (next === 'key-stage') {
    res.redirect('/jobs/new/key-stage')
    return
  }
  res.redirect('/jobs/new/subjects')
  })

  router.post('/jobs/new/subjects', (req, res) => {
    goToSectionSummary(req, res, 'job-details', 'job-role-phase-subjects')
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
    const data = req.session.data || {}
    if (!createJobRoleRouting.requiresTeachingKeyStageFlow(data)) {
      return res.redirect('/jobs/new/section-summary/job-details')
    }
    const phase = data.createJob && data.createJob.phase
    if (!createJobRoleRouting.shouldAskKeyStage(phase)) {
      return res.redirect('/jobs/new/subjects')
    }
    renderCreateJobPage('jobs/new/key-stage', req, res)
  })

  router.get('/jobs/new/subjects', (req, res) => {
    const data = req.session.data || {}
    const teachingFlow = createJobRoleRouting.requiresTeachingKeyStageFlow(data)
    if (!teachingFlow) {
      return res.redirect('/jobs/new/section-summary/job-details')
    }
    if (data.subjects) {
      data.createJob = data.createJob || {}
      data.createJob.subjects = Array.isArray(data.subjects) ? data.subjects : [data.subjects]
    }
    const phase = data.createJob && data.createJob.phase
    const backFromSubjectsHref = createJobRoleRouting.shouldAskKeyStage(phase)
      ? '/jobs/new/key-stage'
      : '/jobs/new/phase'
    const orgName = req.session.user.organisation.name
    const showCollegeSubjectList = createJobRoleRouting.phaseUsesCollegeSubjectList(phase, orgName)
    res.render('jobs/new/subjects', {
      showCollegeSubjectList,
      backFromSubjectsHref,
      subjectItems: buildCreateJobSubjectItems(data),
      hideAdditionalAllowances: isCollegeFeCreateJob(data, req.session.user)
    })
  })

  router.get('/jobs/new/school-visits', (req, res) => {
    renderCreateJobPage('jobs/new/school-visits', req, res)
  })

  router.post('/jobs/new/school-visits', (req, res) => {
    continueCreateJobTask(req, res, 'school-visits', '/jobs/new/sponsorship2')
  })

  router.get('/jobs/new/sponsorship2', (req, res) => {
    renderCreateJobPage('jobs/new/sponsorship2', req, res)
  })

  router.post('/jobs/new/sponsorship2', (req, res) => {
    goToSectionSummary(req, res, 'about-the-role', 'visa-sponsorship')
  })

  router.get('/jobs/new/listing-dates', (req, res) => {
    renderCreateJobPage('jobs/new/listing-dates', req, res)
  })

  router.post('/jobs/new/listing-dates', (req, res) => {
    continueCreateJobTask(req, res, 'listing-dates', '/jobs/new/application_method')
  })

  router.post('/jobs/new/start-date', (req, res) => {
    goToSectionSummary(req, res, 'pay-and-contract', 'job-start-date')
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
    goToSectionSummary(req, res, 'applications-and-publish', 'contact-details')
  })

  router.post('/jobs/new/check', (req, res) => {
    createJobTaskProgress.markPublished(req)
    res.redirect('/jobs/new/confirmation')
  })

  router.get('/jobs/new/anonymised', (req, res) => {
    renderCreateJobPage('jobs/new/anonymised', req, res)
  })

  router.post('/jobs/new/anonymised', (req, res) => {
    continueCreateJobTask(req, res, 'application-method', '/jobs/new/contact-details')
  })

  router.get('/jobs/new/website', (req, res) => {
    renderCreateJobPage('jobs/new/website', req, res)
  })

  router.post('/jobs/new/website', (req, res) => {
    continueCreateJobTask(req, res, 'application-method', '/jobs/new/contact-details')
  })

  router.post('/jobs/new/receive_applications', (req, res) => {
    continueCreateJobTask(req, res, 'application-method', '/jobs/new/contact-details')
  })

  router.post('/jobs/new/role_all', (req, res) => {
      const data = req.session.data || {}
      const org = req.session.user.organisation.name

      if (org == 'Hope college'){
        req.session.data.createJob ??= {};
        req.session.data.createJob.phase = 'further education or college';
        if (createJobRoleRouting.requiresTeachingKeyStageFlow(data)) {
          res.redirect('/jobs/new/subjects');
        } else {
          goToSectionSummary(req, res, 'job-details', 'job-role-phase-subjects')
        }
        return
      }

      res.redirect('/jobs/new/phase');
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
    res.redirect('/jobs/new/subjects')
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

    if (validator.validate()) {
      continueCreateJobTask(req, res, 'contract-working-pattern', '/jobs/new/salary')
    } else {
      res.render('jobs/new/working-patterns')
    }
  })

}