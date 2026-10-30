const userHelper = require('../helpers/user')

function signInFromQuery (req, res) {
  const emailAddress = req.query.userEmailAddress
  if (!emailAddress) {
    return false
  }

  delete req.session.data
  const user = userHelper.getUser(emailAddress)
  if (!user) {
    return false
  }

  res.locals.user = req.session.user = user
  return true
}

const bootstrapUserFromQuery = (req, res, next) => {
  if (!req.session.user) {
    signInFromQuery(req, res)
  }
  next()
}

const checkIsAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next()
    return
  }

  if (signInFromQuery(req, res)) {
    next()
    return
  }

  delete req.session.data
  const returnUrl = encodeURIComponent(req.originalUrl.split('?')[0])
  res.redirect(`/account/sign-in?returnUrl=${returnUrl}`)
}

exports.bootstrapUserFromQuery = bootstrapUserFromQuery
exports.checkIsAuthenticated = checkIsAuthenticated
