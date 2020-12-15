const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bcrypt = require('bcryptjs')
const { number } = require('@hapi/joi')

const UserSchema = new Schema({
  avatar: {
    type: String,
    default: ""
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  userName: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  decks: [{
    type: Schema.Types.ObjectId,
    ref: 'Deck'
  }],
  totalPosts: {
    type: Number,
    default: 0
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  follow: {
    type: Schema.Types.ObjectId,
    ref: 'Follow'
  }
})

UserSchema.methods.isValidPassword = async function(newPassword) {
  try {
    console.log("validatePassword: ", newPassword)
    console.log("hashedPassword: ", this.password);
    
    return await bcrypt.compare(newPassword, this.password)
  } catch (error) {
    throw new Error(error)
  }
}


const User = mongoose.model('User', UserSchema)
module.exports = User