const User = require('../models/User')
const Follow = require('../models/Follow')

const getFollow = async (req, res, next) => {
  console.log("Calling follow function");
  const { userID } = req.value.params;
  // Get user
  const follow = await Follow.find({});
  // console.log("Get Follower: ", user)
  return res.status(200).json({ Follow: follow });
}

const newFollow = async (req, res, next) => {
  const { userID } = req.value.params;
  const { following } = req.value.body
  // Get user
  const followingUser = await User.findById(userID)
  const followedUser = await User.findById(following)

  var followForFollwingUser = await Follow.findOne({owner: userID});
  
  if(!followForFollwingUser){
    console.log("calling create new follow model")
    followForFollwingUser = new Follow()
  } 
  console.log(followForFollwingUser.followings)
  const foundFollowingUser = followForFollwingUser.followings.find(followingID => {
    return followingID == following
  })
  
  if(foundFollowingUser) return res.status(200).json({ status: "you followed this user" });

  followForFollwingUser.owner = followingUser._id
  followForFollwingUser.followings.push(following)
  followingUser.follow = followForFollwingUser._id

  var followForFollwedUser = await Follow.findOne({owner: following});
  if(!followForFollwedUser){
    followForFollwedUser = new Follow()
  } 

  followForFollwedUser.owner = followedUser._id
  followForFollwedUser.followers.push(userID)
  followedUser.follow = followForFollwedUser._id

  // var totalFollowers = followForFollwedUser.totalFollower
  // totalFollowers = totalFollowers + 1;
  ++followForFollwedUser.totalFollower
  ++followForFollwingUser.totalFollowing
  console.log("Follow: ", followForFollwingUser.totalFollowing);
  console.log("Followed: ", followForFollwedUser.totalFollower);
  followingUser.save()
  followedUser.save()

  followForFollwedUser.save()
  followForFollwingUser.save()
  return res.status(200).json({ success: true });
}

const getFollower = async (req, res, next) => {
  console.log("Calling follower function");
  const { userID } = req.value.params;
  // Get user
  const user = await User.findById(userID).populate("follow");
  // console.log(user);
  // console.log("Get Follower: ", user)
  return res.status(200).json({ follower: user.follow.followers });
}

const getFollowing = async (req, res, next) => {
  console.log("Calling following function");
  const { userID } = req.value.params;
  // Get user
  const user = await User.findById(userID).populate("follow");
  //console.log(user);
  // console.log("Get Follower: ", user)
  return res.status(200).json({ followings: user.follow.followings });
}

const deleteFollow = async (req, res, next) => {
  const { userID } = req.value.params;
  const { following } = req.value.body
  // Get user
  const followingUser = await User.findById(userID)
  const followedUser = await User.findById(following)

  const followForFollwingUser = await Follow.findById(followingUser.follow)
  const followForFollwedUser = await Follow.findById(followedUser.follow)

  console.log(followForFollwedUser)
  console.log(followForFollwingUser)
  console.log("calling unfollow function")

  followForFollwedUser.followers.pull(followingUser._id)
  followForFollwingUser.followings.pull(followedUser._id)

  --followForFollwedUser.totalFollower
  --followForFollwingUser.totalFollowing

  followForFollwingUser.save()
  followForFollwedUser.save()

  return res.status(200).json({success: true})
}

module.exports = {
  getFollow,
  getFollower,
  getFollowing,
  newFollow,
  deleteFollow,
}