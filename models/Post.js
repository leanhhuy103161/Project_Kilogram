const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    description: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    totalLike: {
        type: Number,
        default: 0
    },
    totalComment: {
        type: Number,
        default: 0
    },
    image: {
        type: String
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: {
        type: Schema.Types.ObjectId,
        ref: 'Like'
    },
    dateCreate: {
      type: Date,
      default: Date.now
    }
})

const Post = mongoose.model('Post', PostSchema)
module.exports = Post