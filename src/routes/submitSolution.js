module.exports = (App) => {
  App.express.post('/submitSolution', async (req, res) => {
    try {
      await App.db.SolutionLog.create({
        questId: req.body.questId || -1,
        solution: req.body.solution || '',
        userId: req.body.userId || '',
      })
      res.send('ok')
      return
    } catch (e) {
      console.log(e)
    }
    res.send('bad')
  })
}
