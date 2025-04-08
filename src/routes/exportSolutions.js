module.exports = (App) => {
  App.express.post('/exportSolutions', async (req, res) => {
    try {
      if (req.body.password === process.env.BACKEND_PASSWORD) {
        const ts = parseInt(req.body.ts || '0')
        const solutions = await App.db.SolutionLog.findAll(
          ts > 0
            ? { where: { createdAt: { [App.db.Op.gt]: new Date(ts) } } }
            : undefined
        )
        const output = []
        for (const entry of solutions) {
          output.push({
            questId: entry.questId,
            solution: entry.solution,
            createdAt: entry.createdAt,
            userId: entry.userId,
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
