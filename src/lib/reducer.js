module.exports = (acc, val) => {
  const ts = new Date(val.createdAt).getTime()

  function createUserIfNotExists() {
    if (!acc[val.userId]) {
      acc[val.userId] = {
        userId: val.userId,
        firstActive: ts,
        lastActive: ts,
        solved: [],
        name: '',
      }
    }
  }
  const result = /^quest_complete_([\d]+)$/.exec(val.event)
  if (result) {
    createUserIfNotExists()
    const id = parseInt(result[1])
    if (ts < acc[val.userId].firstActive) {
      acc[val.userId].firstActive = ts
    }
    if (!acc[val.userId].solved.includes(id)) {
      acc[val.userId].solved.push(id)
      if (ts > acc[val.userId].lastActive) {
        acc[val.userId].lastActive = ts
      }
    }
  }

  const result2 = /^set_name_(.+)$/.exec(val.event)
  if (result2) {
    createUserIfNotExists()
    const name = result2[1].trim()
    acc[val.userId].name = name
  }

  const result3 = /^delete_user$/.exec(val.event)
  if (result3) {
    if (acc[val.userId] && acc[val.userId].name) {
      acc[val.userId].name = undefined
    }
  }

  return acc
}
