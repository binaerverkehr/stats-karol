module.exports = (App) => {
  App.express.post('/submit', async (req, res) => {
    try {
      const { event, userId } = req.body
      await App.db.Event.create({
        event: event || '',
        userId: userId || '',
      })
      App.cache.append({
        event: event || '',
        userId: userId || '',
        createdAt: Date.now(),
      })
      res.send('ok')
      return
    } catch (e) {
      console.log(e)
    }
    res.send('bad')
  })
}
