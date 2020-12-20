const Like = require('../models/Like')
const User = require('../models/User')
const Post = require('../models/Post')


// delete a like in a post
const deleteLike = async (req, res, next) => {
  console.log("call delete like function")
  const { likeID } = req.value.params
  // const { userLiked, postIsLiked }
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
  const { postIsLiked, userLiked } = req.value.body
  // Find post had this like
  const post = await Post.findById(postIsLiked)
 
  var like = await Like.find({postIsLiked: postIsLiked})

  if(like.length == 0) {
    console.log("if");
    like = req.value.body
    const newLike = new Like(like)
    await newLike.save()
    ++post.totalLike;
    post.likes = newLike._id
    await post.save()
    return res.status(201).json({like: newLike})
  }
  else if(like[0].userLiked.length != 0) {
    console.log("else if", like[0].userLiked);
    const userWasLiked = like[0].userLiked
    userWasLiked.forEach(user => {
      if(user == userLiked) {
        console.log(user);
        return res.status(200).json({status: "you already liked"})
      }
    });
  }
  else {
    console.log("else");
    ++post.totalLike;
    await post.save()
    like[0].userLiked.push(userLiked)
    await like[0].save()
    return res.status(201).json({like: like[0]})
  }
  
}



const dislike = async (req, res, next) => {
  console.log("calling dislike function")
  const {postIsLiked, userLiked} = req.value.body
  const post = await Post.findById(postIsLiked)
  // const user = await User.findById(userLiked)
  --post.totalLike;
  console.log(post)
  const like = await Like.findById( post.likes)

  like.userLiked.pull(userLiked)
  console.log(post)
  console.log(like)
  await post.save()
  await like.save()
  return res.status(201).json({status: "disliked"})
}

module.exports = {
    deleteLike,
    getLike,
    index,
    newLike,
    dislike
}