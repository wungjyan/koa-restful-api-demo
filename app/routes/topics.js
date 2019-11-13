const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({ prefix: '/topics' })
const {
  find,
  create,
  findById,
  update,
  listTopicFollowers,
  checkTopicExist
} = require('../controllers/topics')

const auth = jwt({ secret: 'jwt-secret' })

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', checkTopicExist, findById)
router.patch('/:id', auth, checkTopicExist, update)
router.get('/:id/followers', checkTopicExist, listTopicFollowers)

module.exports = router
