module.exports = (App) => {
  App.express.get('/mod', (_, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="de">
        <head>
          <meta charset="utf-8">
          <title>Robot Karol Stats Mod Panel</title>
        </head>
        <body>
          <form method="post">
            <label>Passwort: <input type="password" name="password"/></label>
            <input type="submit">
          </form>
        </body>
      </html>
    `)
  })

  App.express.post('/mod', async (req, res) => {
    try {
      if (req.body.password === App.secrets.backend_password) {
        const cutoff = Date.now() - 28 * 24 * 1000 * 60 * 60
        const cache = App.cache.get()
        users = Object.values(cache).filter(
          (entry) => entry.lastActive > cutoff
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
                  ).toISOString()} - ${
                    user.name
                      ? `<strong>${user.name}</strong>`
                      : '<em>gelöscht</em>'
                  } ${user.solved.length} Aufgaben gelöst [${user.solved.join(
                    ', '
                  )}] <a href="#" onClick="deleteUser('${
                    user.userId
                  }'); return false;">löschen</a></p>
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
    } catch (e) {
      console.log(e)
    }
    res.send('bad')
  })
}
