const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    postWasCommented: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      unique: true
    },
    commented: {
      type: String
    },
    userCommented: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
    },
    dateComment: {
      type: Date
    }
})

const Comment = mongoose.model('Comment', CommentSchema)
module.exports = Comment