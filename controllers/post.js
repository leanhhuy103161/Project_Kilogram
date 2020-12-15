const Post = require('../models/Post')
const User = require('../models/User')

const deletePost = async (req, res, next) => {
    const { postID } = req.value.params

    // Get a post
    const post = await Post.findById(postID)
    const ownerID = post.owner

    // Get a owner
    const owner = await User.findById(ownerID)

    // Remove the deck
    await post.remove()

    --owner.totalPosts

    // Remove deck from owner's decks list
    owner.posts.pull(post)
    await owner.save()

    return res.status(200).json({ success: true })
}

const getPost = async (req, res, next) => {
    const post = await Post.findById(req.value.params.postID)

    return res.status(200).json({post})
}

const index = async (req, res, next) => {
    const posts = await Post.find({})

    return res.status(200).json({posts})
}

const newPost = async (req, res, next) => {
   // Find owner
   const owner = await User.findById(req.value.body.owner)

   // Create a new deck
    const post = req.value.body
    delete post.owner

    post.owner = owner._id
    const newPost = new Post(post)
    await newPost.save()

    ++owner.totalPosts
    // Add newly created deck to the actual decks
    owner.posts.push(newPost._id)
    await owner.save()

    return res.status(201).json({post: newPost})
}

const replacePost = async (req, res, next) => {
    const { postID } = req.value.params
    const newPost = req.value.body
    const result = await Post.findByIdAndUpdate(postID, newPost)
    // Check if put user, remove deck in user's model
    return res.status(200).json({ success: true })
}

const updatePost = async (req, res, next) => {
    const { postID } = req.value.params
    const newPost = req.value.body
    const result = await Post.findByIdAndUpdate(postID, newPost)
    // Check if put user, remove deck in user's model
    return res.status(200).json({ success: true })
}

module.exports = {
    deletePost,
    getPost,
    index,
    newPost,
    replacePost,
    updatePost
}