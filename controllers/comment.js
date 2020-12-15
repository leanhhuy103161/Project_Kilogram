const Post = require('../models/Post')
const Comment = require('../models/Comment')

const deleteComment = async (req, res, next) => {
    const { commentID } = req.value.params

    // Get a comment
    const comment = await Comment.findById(commentID)
    const postHadCommentedID = comment.postWasCommented

    // Get a post 
    const post = await User.findById(postHadCommentedID)

    // Remove the comment
    await Comment.remove()

    // Remove comment from post's comments list
    post.comments.pull(comment)
    await post.save()

    return res.status(200).json({ success: true })
}

const getComment = async (req, res, next) => {
    const comment = await Comment.findById(req.value.params.commentID)

    return res.status(200).json({comment})
}

const index = async (req, res, next) => {
    const comments = await Comment.find({})

    return res.status(200).json({comments})
}

const newComment = async (req, res, next) => {
   // Find post had that comment
   const post = await Post.findById(req.value.body.postWasCommented)

   // Create a new comment
    const comment = req.value.body
    delete comment.postWasCommented

    comment.postWasCommented = post._id
    const newComment = new Deck(comment)
    await newComment.save()

    // Add newly created comment to the actual post's comments
    post.comments.push(newComment._id)
    await post.save()

    return res.status(201).json({comment: newComment})
}

const replaceComment = async (req, res, next) => {
    const { commentID } = req.value.params
    const newComment = req.value.body
    const result = await Comment.findByIdAndUpdate(commentID, newComment)
    // Check if put user, remove deck in user's model
    return res.status(200).json({ success: true })
}

const updateComment = async (req, res, next) => {
    const { commentID } = req.value.params
    const newComment = req.value.body
    const result = await Comment.findByIdAndUpdate(commentID, newComment)
    // Check if put user, remove deck in user's model
    return res.status(200).json({ success: true })
}

module.exports = {
    deleteComment,
    getComment,
    index,
    newComment,
    replaceComment,
    updateComment
}