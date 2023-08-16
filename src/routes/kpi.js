module.exports = (App) => {
  if (!process.env.UBERSPACE) {
    App.express.get('/kpi', async (_, res) => {
      const countByDate = {}

      let lastSeenId = -1

      for (;;) {
        const events = await App.db.Event.findAll({
          order: [['id', 'ASC']],
          limit: 10000,
          where: { id: { [App.db.Op.gt]: lastSeenId } },
          raw: true,
        })
        if (!events || events.length == 0) break
        lastSeenId = events[events.length - 1].id
        events.forEach((event) => {
          const key = event.createdAt.substring(0, 10)
          const entry = (countByDate[key] = countByDate[key] || {
            sessions: new Set(),
          })
          entry.sessions.add(event.userId)
        })
      }

      const entries = Object.entries(countByDate)
      const counts = []

      for (let i = 0; i + 27 < entries.length; i++) {
        const sessions = new Set()
        let sum = 0
        for (let j = 0; j < 28; j++) {
          entries[i + j][1].sessions.forEach((el) => sessions.add(el))
          sum += entries[i + j][1].sessions.size
        }
        console.log(sum, sessions.size)
        counts.push(sessions.size)
      }

      entries.sort((a, b) => a[0].localeCompare(b[0]))
      res.send(`
      <!doctype html>
      <html lang="de">
        <head>
          <meta charset=utf-8>
          <title>Übersicht monatliche Sessions auf Robot Karol Online</title>
        </head>
        <body>
          <h1>Übersicht monatliche Sessions auf Robot Karol Online</h1>
          <div style="width:100%;height:600px;position:relative;">
            <canvas id="chart"></canvas>
          </div>
  
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  
          <script>
            const ctx = document.getElementById('chart');
  
            new Chart(ctx, {
              type: 'line',
              data: {
                labels: ${JSON.stringify(entries.slice(27).map((e) => e[0]))},
                datasets: [{
                  label: 'Sessions in den letzten 28 Tagen',
                  data: ${JSON.stringify(counts)},
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
    })
  }
}
