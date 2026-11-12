
// NPM dependencies
const browserSync = require('browser-sync')

// Local dependencies
const server = require('./server.js')
const config = require('./app/config.js')
const utils = require('./lib/utils.js')

// Set up configuration variables
var useBrowserSync = config.useBrowserSync.toLowerCase()
var env = utils.getNodeEnv()

utils.findAvailablePort(server, function (port) {
  if (env === 'production' || useBrowserSync === 'false') {
    console.log('Listening on port ' + port + '   url: http://localhost:' + port)
    server.listen(port)
    return
  }

  const appPort = port - 50
  server.listen(appPort, function () {
    const sync = browserSync.create()
    sync.init({
      proxy: 'localhost:' + appPort,
      port: port,
      ui: false,
      files: ['public/**/*.*', 'app/views/**/*.*'],
      ghostMode: false,
      open: false,
      notify: false,
      logLevel: 'error'
    }, function (err) {
      if (err) {
        console.error('BrowserSync could not start on port ' + port + ': ' + err.message)
        console.error('Use http://localhost:' + appPort + ' (Express only), or stop the other dev server on port ' + port + '.')
        return
      }
      console.log('Listening on port ' + port + '   url: http://localhost:' + port)
    })
  })
})
