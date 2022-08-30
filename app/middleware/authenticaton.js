const checkIsAuthenticated = (req, res, next) => {
  if (req.session.user) {
    // the signed in user
    // res.locals.user = req.session.user
    next()
  } else {
    delete req.session.data
    res.redirect(`/account/sign-in?returnUrl=${req.path}`)
  }
}

exports.checkIsAuthenticated = checkIsAuthenticated