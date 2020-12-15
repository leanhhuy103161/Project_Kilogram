const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FollowsSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    totalFollower: {
        type: Number,
        default: 0
    },
    totalFollowing: {
        type: Number,
        default: 0
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    followings: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]
})

const Follows = mongoose.model('Follow', FollowsSchema)
module.exports = Follows