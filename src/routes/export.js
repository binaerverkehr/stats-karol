module.exports = (App) => {
  App.express.post('/export', async (req, res) => {
    try {
      if (req.body.password === process.env.BACKEND_PASSWORD) {
        const ts = parseInt(req.body.ts || '0')
        const data = await App.db.Event.findAll(
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
      return
    } catch (e) {
      console.log(e)
    }
    res.send('bad')
  })
}
