module.exports = (App) => {
  void (async function start() {
    await App.db.authenticate()
    await App.db.sync()
    await App.cache.build()
    App.express.listen(3006, () => {
      console.log('server started on port 3006')
    })
  })()
}

/*


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
