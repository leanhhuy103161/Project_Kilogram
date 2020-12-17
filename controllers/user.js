const bcrypt = require('bcryptjs')
const Deck = require("../models/Deck");
const User = require("../models/User");
const Post = require("../models/Post")

const { JWT_SECRET } = require('../configs')
const JWT = require('jsonwebtoken')

// Create Token
const encodedToken = (userID) => {
  return JWT.sign({
    iss: 'Le Anh Huy',
    sub: userID,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 3)
  }, JWT_SECRET)
}

// get a user
const getUser = async (req, res, next) => {
  const { userID } = req.value.params; 

  // find user
  // const user = await User.findById(userID);

  // get  informations of user
  const user = await User.findById(userID);

  return res.status(200).json({ user });
};

const getUserDecks = async (req, res, next) => {
  const { userID } = req.value.params;

  // Get user
  const user = await User.findById(userID).populate("decks");

  return res.status(200).json({ decks: user.decks });
};

// get all posts of user / page
const getUserPosts = async (req, res, next) => {
  const { userID } = req.value.params;
  var page = req.value.query.page
  if(page) {
    page = parseInt(page)
    const pageSize = 12
    var skip = (page - 1)*pageSize

    const posts = await Post.find({owner: userID}).skip(skip).limit(pageSize)
    // console.log(posts);
    return res.status(200).json({ posts: posts });
  }
  // Get user
  const user = await User.findById(userID).populate("posts");
  return res.status(200).json({ posts: user.posts });
};

// get all users
const index = async (req, res, next) => {
  const users = await User.find({});

  return res.status(200).json({ users });
};

// search Users / page
const searchUsers = async (req, res, next) => {
  const { userName } = req.value.body
  var page = req.value.query.page
  if(page) {
    page = parseInt(page)
    const pageSize = 4
    var skip = (page - 1)*pageSize
    const foundUsers = await User.find({lastName: { $regex: userName}}).skip(skip).limit(pageSize)
    const foundLastName = []
    foundUsers.forEach(user => {
      found = {}
      found._id = user._id
      found.lastName = user.lastName
      found.avatar = user.avatar
      foundLastName.push(found)
    });
    //return foundLastName;
    return res.status(200).json({found: foundLastName});
  }
  const foundUsers = await User.find({lastName: { $regex: userName}})
  console.log(foundUsers)
  const foundLastName = []
  foundUsers.forEach(user => {
    found = {}
    found._id = user._id
    found.lastName = user.lastName
    found.avatar = user.avatar
    foundLastName.push(found)
  });
  return res.status(200).json({found: foundLastName})
}

// create User
const newUser = async (req, res, next) => {
  const newUser = new User(req.value.body);

  await newUser.save();

  return res.status(201).json({ user: newUser });
};

const newUserDeck = async (req, res, next) => {
  const { userID } = req.value.params;

  // Create a new deck
  const newDeck = new Deck(req.value.body);
  
  // Get user
  const user = await User.findById(userID);
 
  // Assign user as a deck's owner
  newDeck.owner = user;
  // console.log(newDeck.owner)
  console.log(newDeck)
  // Save the deck
  await newDeck.save();
  
  // Add deck to user's decks array 'decks'
  user.decks.push(newDeck._id);

  // Save the user
  await user.save();
  
  return res.status(201).json({ deck: newDeck });
};

const newUserPost = async (req, res, next) => {
  const { userID } = req.value.params;

  // Create a new deck
  const newPost = new Post(req.value.body);
  
  // Get user
  const user = await User.findById(userID);
 
  // Assign user as a deck's owner
  newPost.owner = user;
  // Save the deck

  ++user.totalPosts

  await newPost.save();
  
  user.posts.push(newPost._id);

  // update the user
  await user.save();
  
  return res.status(201).json({ postID: newPost._id });
};

const replaceUser = async (req, res, next) => {
  // enforce new user to old user
  const { userID } = req.value.params;

  const newUser = req.value.body;

  const result = await User.findByIdAndUpdate(userID, newUser);

  return res.status(200).json({ success: true });
};

const secret = async (req, res, next) => {
  console.log("Called to secret function.");
  return res.status(200).json({ resources: true })
};

const signIn = async (req, res, next) => {
  
  // Encode a token
  console.log('req: ', req.user)
  const token = encodedToken(req.user._id)
  const ID = req.user._id
  res.setHeader('Authorization', token)
  console.log("calling sign in function")
  return res.status(201).json({ _id: ID })
};

const signUp = async (req, res, next) => {
  var { firstName, lastName, email, password, avatar, userName } = req.value.body
 
  // Check if there is a user with the same user
  const foundUser = await User.findOne({ email })
  if (foundUser) return res.status(403).json({ error: { message: 'Email is already in use.' }})

  //Generate a salt
  console.log('password :', password)
  const salt = await bcrypt.genSalt(10)
  console.log('salt ', salt)
  //Generate a password hash
  const hashedPassword = await bcrypt.hash(password, salt)
  console.log('password hashed: ', hashedPassword)
  //Re-assign password hashed
  password = hashedPassword
  
  // Create a new user
  const newUser = new User({ firstName, lastName, email, password, avatar, userName })
  newUser.save() 

  // Encode a token
  const token = encodedToken(newUser._id)

  res.setHeader('Authorization', token)
  return res.status(201).json({ _id: newUser._id })
};

const updateUser = async (req, res, next) => {
  // number of fields
  const { userID } = req.value.params;

  const newUser = req.value.body;
  // console.log(newUser);
  const result = await User.findByIdAndUpdate(userID, newUser);

  return res.status(200).json({ success: true });
};

module.exports = {
  getUser,
  getUserDecks,
  index,
  newUser,
  newUserDeck,
  replaceUser,
  secret,
  signIn,
  signUp,
  updateUser,
  newUserPost,
  getUserPosts,
  searchUsers
};
