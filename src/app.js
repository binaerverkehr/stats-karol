module.exports = (App) => {
  // starting server
  void (async function start() {
    await App.db.authenticate()
    await App.db.sync()
    // await buildCache()
    App.express.listen(3006, () => {
      console.log('server started')
    })
  })()
}
/*
const shortid = require('shortid')

App.express.post('/submit', async (req, res) => {
  try {
    await App.db.MEvent2.create({
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

App.express.post('/submitSolution', async (req, res) => {
  try {
    await App.db.MSolutionLog2.create({
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

App.express.post('/share', async (req, res) => {
  try {
    const publicId = shortid.generate()
    await App.db.MShare.create({
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

App.express.post('/quest_share', async (req, res) => {
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

App.express.get('/load/:id', async (req, res) => {
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

App.express.get('/quest/load/:id', async (req, res) => {
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

App.express.get('/export', (req, res) => {
  res.send(exportTemplate)
})

App.express.get('/exportSolutions', (req, res) => {
  res.send(exportTemplate)
})

App.express.post('/export', async (req, res) => {
  try {
    if (req.body.password === App.secrets.backend_password) {
      const ts = parseInt(req.body.ts || '0')
      const data = await MEvent.findAll(
        ts > 0
          ? { where: { createdAt: { [App.db.Op.gt]: new Date(ts) } } }
          : undefined
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

App.express.post('/exportSolutions', async (req, res) => {
  try {
    if (req.body.password === App.secrets.backend_password) {
      const ts = parseInt(req.body.ts || '0')
      const solutions = await App.db.MSolutionLog2.findAll(
        ts > 0
          ? { where: { createdAt: { [App.db.Op.gt]: new Date(ts) } } }
          : undefined
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

App.express.get('/mod', (req, res) => {
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

App.express.post('/mod', async (req, res) => {
  if (req.body.password === App.secrets.backend_password) {
    const cutoff = Date.now() - timeSpan
    const cache = getCache()
    users = Object.values(cache).filter((entry) => entry.lastActive > cutoff)
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
        } Aufgaben gelöst [${user.solved.join(
          ', '
        )}] <a href="#" onClick="deleteUser(${user.userId})">löschen</a></p>
    `
      )
      .join('')}

      <script>
        function deleteUser(userId) {
          fetch('/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ event: 'delete_user', userId }),
          }).then(() => {
            alert('ok')
          })
        }
      </script>
  </body>
</html>
    
    `)
    return
  }
  res.send('wrong pw')
})

/*app.get('/delete/:id', async (req, res) => {
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

  const result3 = /^delete_user$/.exec(val.event)
  if (result3) {
    if (acc[val.userId] && acc[val.userId].name) {
      acc[val.userId].name = undefined
    }
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
  if (
    Date.now() - cacheCreated >
    24 * 60 * 60 * 1000 * 30 /* 30 days, we trust in the cache
  ) {
    if (!isRebuilding) {
      isRebuilding = true
      setTimeout(() => {
        void buildCache()
      })
    }
  }
  return cache
}

App.express.get('/highscore', async (req, res) => {
  const cutoff = Date.now() - timeSpan
  const cache = getCache()
  res.json(
    Object.values(cache).filter(
      (entry) =>
        entry.lastActive > cutoff &&
        entry.solved.includes(1) &&
        acc[val.userId].name
    )
  )
})

/*app.get('/overview', async (req, res) => {
  const data = await MEvent.findAll()
  const countByDate = data.reduce((res, obj) => {
    const key = obj.createdAt.toISOString().substring(0, 10)
    const entry = (res[key] = res[key] || { sessions: new Set() })
    entry.sessions.add(obj.userId)
    return res
  }, {})

  const entries = Object.entries(countByDate)

  entries.sort((a, b) => a[0].localeCompare(b[0]))
  res.send(`
    <!doctype html>
    <html lang="de">
      <head>
        <meta charset=utf-8>
        <title>Übersicht monatlich aktive NutzerInnen von Robot Karol Online</title>
      </head>
      <body>
        <h1>Übersicht monatlich aktive NutzerInnen von Robot Karol Online</h1>
        <div style="width:100%;height:600px;position:relative;">
          <canvas id="chart"></canvas>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

        <script>
          const ctx = document.getElementById('chart');

          new Chart(ctx, {
            type: 'line',
            data: {
              labels: ${JSON.stringify(entries.map((e) => e[0]))},
              datasets: [{
                label: 'aktie NutzerInnen am Tag',
                data: ${JSON.stringify(entries.map((e) => e[1].sessions.size))},
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              },
              maintainAspectRatio: false,
            }
          });
        </script>
      </body>
    </html>
  `)
})*/

function generateFriendlyUrl() {
  const characters = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let url = ''
  for (let i = 0; i < 4; i++) {
    url += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return url
}

async function checkIfPublicIdExists(publicId) {
  const count = await App.db.MQuestShare.count({
    where: {
      publicId,
    },
  })
  return count > 0
}
