module.exports = (App) => {
  App.express.get('/random', async (req, res) => {
    try {
      const quests = await App.db.QuestShare.findAll({
        attributes: ['publicId'],
        raw: true,
      })
      const randomChoice = quests[Math.floor(Math.random() * quests.length)]

      res.send(randomChoice.publicId)
      return
    } catch (e) {
      console.log(e)
    }
    res.send('bad')
  })
}
