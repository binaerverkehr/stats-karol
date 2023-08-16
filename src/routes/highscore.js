module.exports = (App) => {
  App.express.get('/highscore', async (_, res) => {
    try {
      // cutoff is always 28 days
      const cutoff = Date.now() - 28 * 24 * 1000 * 60 * 60
      const cache = App.cache.get()
      res.json(
        Object.values(cache).filter(
          (entry) =>
            entry.lastActive > cutoff && entry.solved.includes(1) && entry.name
        )
      )
      return
    } catch (e) {
      console.log(e)
    }
    res.send('bad')
  })
}
