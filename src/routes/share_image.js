module.exports = (App) => {
  App.express.post('/share_image', async (req, res) => {
    try {
      let publicId = generateFriendlyUrl()

      await App.db.ImageUrl.create({
        publicId,
        content: typeof req.body.content === 'string' ? req.body.content : '',
      })
      res.send('https://karol.arrrg.de/backend/load_image/' + publicId)
      return
    } catch (e) {
      console.log(e)
    }
    res.send('bad')
  })
}

function generateFriendlyUrl() {
  const characters = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let url = ''
  for (let i = 0; i < 12; i++) {
    url += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return url
}
