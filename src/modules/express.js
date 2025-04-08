const express = require('express')
const cors = require('cors') // Require the cors package

module.exports = (App) => {
  App.express = express()

  // Parse JSON bodies first
  App.express.use(express.json())
  App.express.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

  // CORS configuration
  const corsOptions = {
    origin: 'https://karol.logiklabor.de', // Allow specific origin
    optionsSuccessStatus: 200 // For legacy browser compatibility
  }

  // Use CORS middleware
  App.express.use(cors(corsOptions))

  // The old manual CORS handling below is now removed
  /*
  // manage CORS
  App.express.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Methods',
      'GET, PUT, POST, DELETE, OPTIONS'
    )
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Content-Length, X-Requested-With'
    )

    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
      res.sendStatus(200)
    } else {
      next()
    }
  })
  */
}
