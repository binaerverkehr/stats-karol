const { Sequelize, DataTypes, Op } = require('sequelize')
const express = require('express')
const shortid = require('shortid')
const secrets = require('./secrets.js')

const isUberspace = !!process.env.UBERSPACE

const db = isUberspace
  ? {
      database: 'arrrg_stats_karol',
      username: 'arrrg',
      password: secrets.db_password,
      dialect: 'mariadb',
      dialectOptions: {
        timezone: 'Europe/Berlin',
      },
      logging: false,
    }
  : {
      dialect: 'sqlite',
      storage: './db.sqlite',
      logging: false,
    }

const sequelize = new Sequelize(db)

const MEvent = sequelize.define('MEvent2', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  event: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})

const MShare = sequelize.define('MShare', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  publicId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
})

const MQuestShare = sequelize.define('MQuestShare', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  publicId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
})

const MSolutionLog = sequelize.define('MSolutionLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  questId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  solution: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
})

const MSolutionLog2 = sequelize.define('MSolutionLog2', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  questId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  solution: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
})

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
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

app.post('/submit', async (req, res) => {
  try {
    await MEvent.create({
      event: req.body.event,
      userId: req.body.userId || '',
    })
    if (cache) {
      reducer(cache, {
        event: req.body.event,
        userId: req.body.userId || '',
        createdAt: Date.now(),
      })
    }
    res.send('ok')
    return
  } catch (e) {
    console.log(e)
  }
  res.send('bad')
})

app.post('/submitSolution', async (req, res) => {
  try {
    await MSolutionLog2.create({
      questId: req.body.questId || -1,
      solution: req.body.solution || '',
      userId: req.body.userId || '',
    })
    res.send('ok')
    return
  } catch (e) {
    console.log(e)
  }
  res.send('bad')
})

app.post('/share', async (req, res) => {
  try {
    const publicId = shortid.generate()
    await MShare.create({
      publicId,
      content: typeof req.body.content === 'string' ? req.body.content : '',
    })
    res.send(publicId)
    return
  } catch (e) {
    console.log(e)
  }
  res.send('bad')
})

app.post('/quest_share', async (req, res) => {
  try {
    let publicId = generateFriendlyUrl()
    let tries = 0
    while (!(await checkIfPublicIdExists(publicId)) && tries++ < 10) {
      publicId = generateFriendlyUrl()
    }
    if (tries == 10) {
      res.send('not able to generate unique id')
      return
    }

    await MQuestShare.create({
      publicId,
      content: typeof req.body.content === 'string' ? req.body.content : '',
    })
    res.send(publicId)
    return
  } catch (e) {
    console.log(e)
  }
  res.send('bad')
})

app.get('/load/:id', async (req, res) => {
  try {
    const publicId = req.params.id
    const entry = await MShare.findOne({ where: { publicId } })
    res.send(entry.content)
    return
  } catch (e) {
    console.log(e)
  }
  res.send('bad')
})

app.get('/quest/load/:id', async (req, res) => {
  try {
    const publicId = req.params.id
    const entry = await MQuestShare.findOne({ where: { publicId } })
    res.send(entry.content)
    return
  } catch (e) {
    console.log(e)
  }
  res.send('bad')
})

const exportTemplate = `<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <title>Datenexport Robot Karol Stats</title>
  </head>
  <body>
    <form method="post">
      <label>Password: <input type="password" name="password"/></label>
      <input type="submit">
    </form>
  </body>
</html>`

app.get('/export', (req, res) => {
  res.send(exportTemplate)
})

app.get('/exportSolutions', (req, res) => {
  res.send(exportTemplate)
})

app.post('/export', async (req, res) => {
  try {
    if (req.body.password === secrets.backend_password) {
      const ts = parseInt(req.body.ts || '0')
      const data = await MEvent.findAll(
        ts > 0 ? { where: { createdAt: { [Op.gt]: new Date(ts) } } } : undefined
      )
      const output = []
      for (const entry of data) {
        output.push({
          userId: entry.userId,
          event: entry.event,
          createdAt: entry.createdAt,
        })
      }
      res.json(output)
      return
    }
    res.send('wrong pw')
  } catch (e) {
    console.log(e)
    res.send('bad')
  }
})

app.post('/exportSolutions', async (req, res) => {
  try {
    if (req.body.password === secrets.backend_password) {
      const ts = parseInt(req.body.ts || '0')
      const solutions = await MSolutionLog2.findAll(
        ts > 0 ? { where: { createdAt: { [Op.gt]: new Date(ts) } } } : undefined
      )
      const output = []
      for (const entry of solutions) {
        output.push({
          questId: entry.questId,
          solution: entry.solution,
          createdAt: entry.createdAt,
          userId: entry.userId,
        })
      }
      res.json(output)
      return
    }
    res.send('wrong pw')
  } catch (e) {
    console.log(e)
    res.send('bad')
  }
})

app.get('/mod', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <title>Robot Karol Stats Mod Panel</title>
  </head>
  <body>
    <form method="post">
      <label>Password: <input type="password" name="password"/></label>
      <input type="submit">
    </form>
  </body>
</html>
  
  `)
})

app.post('/mod', async (req, res) => {
  if (req.body.password === secrets.backend_password) {
    const data = await MEvent.findAll()
    const cutoff = Date.now() - timeSpan
    const users = Object.values(data.reduce(reducer, {})).filter(
      (entry) => entry.lastActive > cutoff && entry.solved.includes(1)
    )
    users.sort((a, b) => b.lastActive - a.lastActive)
    res.send(`
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <title>Robot Karol Stats Mod Panel</title>
  </head>
  <body>
    ${users
      .map(
        (user) => `
      <p>${new Date(user.firstActive).toISOString()} bis ${new Date(
          user.lastActive
        ).toISOString()} - <strong>${user.name}</strong> ${
          user.solved.length
        } Aufgaben gelöst [${user.solved.join(', ')}] <a href="/delete/${
          user.userId
        }">löschen</a></p>
    `
      )
      .join('')}
  </body>
</html>
    
    `)
    return
  }
  res.send('wrong pw')
})

app.get('/delete/:id', async (req, res) => {
  const userId = req.params.id
  if (userId) {
    await MEvent.destroy({ where: { userId } })
    res.send('ok')
    cacheCreated = -1
    getCache()
    return
  }
  res.send('no userid')
})

// in-memory cache to reduce server workload

function reducer(acc, val) {
  const ts = new Date(val.createdAt).getTime()

  function createUserIfNotExists() {
    if (!acc[val.userId]) {
      acc[val.userId] = {
        userId: val.userId,
        firstActive: ts,
        lastActive: ts,
        solved: [],
        name: '',
      }
    }
  }
  const result = /^quest_complete_([\d]+)$/.exec(val.event)
  if (result) {
    createUserIfNotExists()
    const id = parseInt(result[1])
    if (ts < acc[val.userId].firstActive) {
      acc[val.userId].firstActive = ts
    }
    if (!acc[val.userId].solved.includes(id)) {
      acc[val.userId].solved.push(id)
      if (ts > acc[val.userId].lastActive) {
        acc[val.userId].lastActive = ts
      }
    }
  }

  const result2 = /^set_name_(.+)$/.exec(val.event)
  if (result2) {
    createUserIfNotExists()
    const name = result2[1].trim()
    acc[val.userId].name = name
  }

  return acc
}

const timeSpan = 28 * 24 * 60 * 60 * 1000 // 28 days

let cache = undefined
let cacheCreated = Date.now()
let isRebuilding = false

async function buildCache() {
  const data = await MEvent.findAll()
  cache = data.reduce(reducer, {})
  cacheCreated = Date.now()
  isRebuilding = false
}

function getCache() {
  if (Date.now() - cacheCreated > 24 * 60 * 60 * 1000 /* 24h */) {
    if (!isRebuilding) {
      isRebuilding = true
      setTimeout(() => {
        void buildCache()
      })
    }
  }
  return cache
}

app.get('/highscore', async (req, res) => {
  const cutoff = Date.now() - timeSpan
  const cache = getCache()
  res.json(
    Object.values(cache).filter(
      (entry) => entry.lastActive > cutoff && entry.solved.includes(1)
    )
  )
})

// starting server
;(async function start() {
  await sequelize.authenticate()
  await sequelize.sync()
  await buildCache()
  app.listen(3006, () => {
    console.log('server started')
  })
})()

function generateFriendlyUrl() {
  const characters = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let url = ''
  for (let i = 0; i < 4; i++) {
    url += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return url
}

async function checkIfPublicIdExists(publicId) {
  const count = await MQuestShare.count({
    where: {
      publicId,
    },
  })
  return count > 0
}
