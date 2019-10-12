const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users')
class UsersCtl {
  async find(ctx) {
    const { per_page = 10 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1)
    const perPage = Math.max(per_page * 1, 1)
    ctx.body = await User.find({ name: new RegExp(ctx.query.q) })
      .limit(perPage)
      .skip((page - 1) * perPage)
  }

  async findById(ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields
      .split(';')
      .filter(f => f)
      .map(f => '+' + f)
      .join('')
    // 动态生成 populate
    const populateStr = fields
      .split(';')
      .filter(f => f)
      .map(f => f)
      .join('')
    const user = await User.findById(ctx.params.id)
      .select(selectFields)
      .populate(populateStr) // populate填充的字段会被返回，且值是引用的某一表
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }

  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const { name } = ctx.request.body
    const repeatedUser = await User.findOne({ name })
    if (repeatedUser) {
      ctx.throw(409, '用户已经占用')
    }
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }

  // 授权
  async checkOwner(ctx, next) {
    // token解析成功后会把用户信息保存在 ctx.state 上
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }

  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false }
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }

  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.status = 204
  }

  async login(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const user = await User.findOne(ctx.request.body)
    if (!user) {
      ctx.throw(401, '用户名和密码不正确')
    }
    const { _id, name } = user
    const token = jsonwebtoken.sign({ _id, name }, 'jwt-secret', {
      expiresIn: '1d'
    })
    ctx.body = { token }
  }

  // 关注列表
  async listFollowing(ctx) {
    const user = await User.findById(ctx.params.id)
      .select('+following')
      .populate('following')
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user.following
  }

  // 粉丝列表
  async listFollowers(ctx) {
    // 查找所有用户，他们的关注列表里包含了请求人的id
    const users = await User.find({ following: ctx.params.id })
    ctx.body = users
  }

  // 检查用户是否存在的中间件
  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    await next()
  }

  // 关注
  async follow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following')
    const list = me.following.map(id => id.toString())
    if (!list.includes(ctx.params.id)) {
      me.following.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }

  // 取消关注
  async unfollow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following')
    // 要取消关注的人的id在所有关注人列表里的索引
    const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.following.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }
}
module.exports = new UsersCtl()
