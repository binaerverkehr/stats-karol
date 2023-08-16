module.exports = (App) => {
  void (async function start() {
    await App.db.sync()
    await App.cache.build()
    App.express.listen(3006, () => {
      console.log('server started on port 3006')
    })
  })()
}

/*

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
