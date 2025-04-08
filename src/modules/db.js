// Don't ask why tables are named this way ... keeping

module.exports = (App) => {
  // Removed Uberspace check, configuration now driven by environment variables

  // Check for required environment variables
  const requiredEnvVars = [
    'DB_DATABASE',
    'DB_USER',
    'DB_PASSWORD',
    'DB_HOST',
  ]
  const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v])

  let dbConfig

  if (missingEnvVars.length > 0) {
    console.warn(
      `WARN: Missing database environment variables: ${missingEnvVars.join(
        ', '
      )}. Falling back to SQLite.`
    )
    dbConfig = {
      dialect: 'sqlite',
      storage: './db.sqlite',
      logging: false,
    }
  } else {
    console.log(
      `INFO: Using MariaDB database ${process.env.DB_DATABASE} on ${process.env.DB_HOST}`
    )
    dbConfig = {
      database: process.env.DB_DATABASE,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306, // Use DB_PORT or default to 3306
      dialect: 'mariadb',
      dialectOptions: {
        timezone: 'Europe/Berlin',
      },
      logging: false,
    }
  }

  require('../lib/dbModel.js')(App, dbConfig)
}
