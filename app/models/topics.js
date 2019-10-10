const mongoose = require('mongoose')
const { Schema, model } = mongoose

const topicSchema = new Schema({
  __v: { type: Number, select: false }
})

module.exports = model('Topic', topicSchema)
