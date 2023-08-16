const reducer = require('../lib/reducer.js')

module.exports = (App) => {
  App.cache = {}

  App.cache.build = async () => {
    if (App.cache.__value) {
      return // don't rebuild cache
    }

    console.log('Start building cache ...')

    const cache = {}
    const batchSize = 10000
    let rowCount = 0
    let lastSeenId = -1

    for (;;) {
      const events = await App.db.Event.findAll({
        order: [['id', 'ASC']],
        limit: batchSize,
        where: { id: { [App.db.Op.gt]: lastSeenId } },
        raw: true,
      })
      if (!events || events.length == 0) break
      rowCount += events.length
      lastSeenId = events[events.length - 1].id
      events.forEach((event) => reducer(cache, event))
    }

    App.cache.__value = cache
    console.log(`  completed, ${rowCount} events processed`)
  }

  App.cache.get = () => {
    return App.cache.__value
  }
}
