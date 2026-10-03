const userHelper = require('../helpers/user')

const checkIsAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next()
    return
  }

  const emailAddress = req.query.userEmailAddress
  if (emailAddress) {
    delete req.session.data
    const user = userHelper.getUser(emailAddress)
    if (user) {
      res.locals.user = req.session.user = user
      next()
      return
    }
  }

  delete req.session.data
  const returnUrl = encodeURIComponent(req.originalUrl.split('?')[0])
  res.redirect(`/account/sign-in?returnUrl=${returnUrl}`)
}

exports.checkIsAuthenticated = checkIsAuthenticated
