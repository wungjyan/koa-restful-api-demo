const Router = require('koa-router')
// const jsonwebtoken = require('jsonwebtoken')
const jwt = require('koa-jwt')
const router = new Router({ prefix: '/users' })
const {
  find,
  create,
  findById,
  update,
  delete: del,
  login,
  checkOwner,
  listFollowing,
  follow,
  checkUserExist,
  unfollow,
  listFollowers
} = require('../controllers/users')

// const auth = async (ctx, next) => {
//   const { authorization = '' } = ctx.request.header
//   const token = authorization.replace('Bearer ', '')
//   try {
//     const user = jsonwebtoken.verify(token, 'jwt-secret')
//     ctx.state.user = user
//   } catch (error) {
//     ctx.throw(401, error.message)
//   }
//   await next()
// }

// 使用 koa-jwt简化操作， 实际类似上面注释部分代码
const auth = jwt({ secret: 'jwt-secret' })

router.get('/', find)
router.post('/', create)
router.get('/:id', findById)
router.patch('/:id', auth, checkOwner, update)
router.delete('/:id', auth, checkOwner, del)
router.post('/login', login)
router.get('/:id/following', listFollowing)
router.get('/:id/followers', listFollowers)
router.put('/following/:id', auth, checkUserExist, follow)
router.delete('/following/:id', auth, checkUserExist, unfollow)
module.exports = router
