const App = {}

require('./modules/secrets.js')(App)
require('./modules/db.js')(App)
require('./modules/express.js')(App)
require('./modules/cache.js')(App)

if (process.env.SAVE2LOCAL) {
  require('./save2local.js')(App)
} else {
  require('./app.js')(App)
}
