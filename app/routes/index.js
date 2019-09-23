const fs = require('fs')

module.exports = async app => {
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') {
      return
    }
    const router = require(`./${file}`)
    app.use(router.routes()).use(router.allowedMethods())
  })
}
