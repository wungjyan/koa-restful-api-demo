const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({ prefix: '/questions' })
const {
  find,
  create,
  findById,
  update,
  delete: del,
  checkQuestionExist,
  checkQuestioner
} = require('../controllers/questions.js')

const auth = jwt({ secret: 'jwt-secret' })

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', checkQuestionExist, findById)
router.patch('/:id', auth, checkQuestionExist, checkQuestioner, update)
router.delete('/:id', auth, checkQuestionExist, checkQuestioner, del)

module.exports = router
