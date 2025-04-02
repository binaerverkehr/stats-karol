module.exports = (App) => {
  App.express.get('/load_image/:id', async (req, res) => {
    try {
      const publicId = req.params.id
      const entry = await App.db.ImageUrl.findOne({ where: { publicId } })
      if (entry) {
        res.send(entry.content)
        return
      }
    } catch (e) {
      console.log(e)
    }
    res.send('bad')
  })
}
