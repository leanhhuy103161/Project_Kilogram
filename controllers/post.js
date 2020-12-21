const Like = require('../models/Like')
const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')

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

const getLikesInPost = async (req, res, next) => {
  const { postID } = req.value.params
  var page = req.value.query.page
  if(page) {
    page = parseInt(page)
    const pageSize = 10
    var skip = (page - 1)*pageSize
    const like = await Like.findOne({postIsLiked: postID}).populate("userLiked").skip(skip).limit(pageSize)
    // console.log(like.userLiked);
    res.status(200).json({user: like.userLiked})
  }
  const like = await Like.findOne({postIsLiked: postID}).populate("userLiked")
  // console.log(like.userLiked);
  res.status(200).json({user: like.userLiked})
}

const checkLikeStatus = async (req, res, next) => {
  const {userID, postID} = req.value.params
  const like = await Like.findOne({postIsLiked: postID}).populate("userLiked")
  const userLiked = like.userLiked
  // console.log(userID);
  // console.log(postID);
  // console.log(userLiked);
  const found = userLiked.find(user => user._id == userID)
  if(found._id) res.status(200).json({likeStatus: true})
  else res.status(200).json({likeStatus: false})
}

const getCommentsInPost = async (req, res, next) => {
  const { postID } = req.value.params
  var page = req.value.query.page
  if(page) {
    // console.log("using page");
    page = parseInt(page)
    const pageSize = 10
    var skip = (page - 1)*pageSize
    const comments = await Comment.find({postWasCommented: postID}).populate("userCommented").skip(skip).limit(pageSize)
    // console.log(comments)
    var userBox = []
    var commentBox = []
    comments.forEach(comment => {
      found = {}
      found.dateComment = comment.dateComment
      found.userCommented = comment.userCommented
      userBox.push(comment.userCommented)
      commentBox.push(found)
    });
    // console.log(userBox)
    // console.log(commentBox)
    var userRequired = []
    for (let index = 0; index < userBox.length; index++){
      found = {}
      found._id = userBox[index]._id
      found.lastName = userBox[index].lastName
      found.firstName = userBox[index].firstName
      found.avatar = userBox[index].avatar
      found.commented = commentBox[index].commented
      found.dateComment = commentBox[index].dateComment
      userRequired.push(found)
    }
    // console.log(userRequired)
    return res.status(200).json({user: userRequired})
  }
  // console.log("not using page");
  const comments = await Comment.find({postWasCommented: postID}).populate("userCommented")
  // console.log(comments)
  var userBox = []
  var commentBox = []
  comments.forEach(comment => {
    found = {}
    found.dateComment = comment.dateComment
    found.userCommented = comment.userCommented
    userBox.push(comment.userCommented)
    commentBox.push(found)
  });
  // console.log(userBox)
  // console.log(commentBox)
  var userRequired = []
  for (let index = 0; index < userBox.length; index++){
    found = {}
    found._id = userBox[index]._id
    found.lastName = userBox[index].lastName
    found.firstName = userBox[index].firstName
    found.avatar = userBox[index].avatar
    found.commented = commentBox[index].commented
    found.dateComment = commentBox[index].dateComment
    userRequired.push(found)
  }
  // console.log(userRequired)
  return res.status(200).json({user: userRequired})
}

module.exports = {
    deletePost,
    getPost,
    index,
    newPost,
    replacePost,
    updatePost,
    getLikesInPost,
    checkLikeStatus,
    getCommentsInPost
}