const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LikeSchema = new Schema({
    userLiked: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    postIsLiked: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
    },
    dateLike: {
      type: Date,
      default: Date.now
    }
})

const Like = mongoose.model('Like', LikeSchema)
module.exports = Like