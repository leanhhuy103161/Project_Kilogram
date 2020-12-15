const Like = require('../models/Like')
const User = require('../models/User')
const Post = require('../models/Post')


// delete a like in a post
const deleteLike = async (req, res, next) => {
    const { likeID } = req.value.params

    // Get a like
    const like = await Like.findById(likeID)
    const postIsLikedID = like.postIsLiked

    // Get a post
    const postIsLiked = await Post.findById(postIsLikedID)

    // Remove the like
    await like.remove()

    // Remove like from post's likes list
    postIsLiked.likes.pull(like)
    await postIsLiked.save()

    return res.status(200).json({ success: true })
}

// get information of a like 
const getLike = async (req, res, next) => {
    const like = await Like.findById(req.value.params.likeID)

    return res.status(200).json({like})
}

// get all likes in database
const index = async (req, res, next) => {
    const likes = await Like.find({})
    return res.status(200).json({likes})
}

// create a like 
const newLike = async (req, res, next) => {
    console.log("call create like function")
    // Find post had this like
    const post = await Post.findById(req.value.body.postIsLiked)
    console.log("Found post had this id", post._id) 
    // Create a new like
    const like = req.value.body
    delete like.owner

    like.postIsLiked = post._id
    const newLike = new Like(like)
    await newLike.save()

    // Add newly created like to the actual likes
    post.likes.push(newLike._id)
    await post.save()

    return res.status(201).json({like: newLike})
}

module.exports = {
    deleteLike,
    getLike,
    index,
    newLike,
}