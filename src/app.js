module.exports = (App) => {
  void (async function start() {
    await App.db.sync()
    await App.cache.build()
    App.express.listen(3006, () => {
      console.log('server started on port 3006')
    })
  })()
}
