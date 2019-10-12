const mongoose = require('mongoose')
const { Schema, model } = mongoose

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false },
  // 地址，行业和关注列表 值都是引用的话题
  locations: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    select: false
  },
  business: { type: Schema.Types.ObjectId, ref: 'Topic', select: false },
  following: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    select: false
  }
})

module.exports = model('User', userSchema)
