const checkIsAuthenticated = (req, res, next) => {
  if (req.session.passport) {
    // the signed in user
    res.locals.passport = req.session.passport
    next()
  } else {
    delete req.session.data
    res.redirect('/sign-in')
  }
}

exports.checkIsAuthenticated = checkIsAuthenticated