const users = require('../data/users.json')
const jobs = require('../data/jobs.json')
const jobseekers = require('../data/jobseekers.json')
const userHelper = require('../helpers/user')

const checkIsAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next()
  } else if(req.query.userEmailAddress) {
    delete req.session.data
    let user = userHelper.getUser(req.query.userEmailAddress)
    if(user) {
      res.locals.user = req.session.user = user
      next()
    } else {
      delete req.session.data
      res.redirect(`/account/sign-in?returnUrl=${req.path}`)
    }
  } else {
    delete req.session.data
    res.redirect(`/account/sign-in?returnUrl=${req.path}`)
  }
}

exports.checkIsAuthenticated = checkIsAuthenticated