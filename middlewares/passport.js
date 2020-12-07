const { required } = require("@hapi/joi");

const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const { ExtractJwt } = require('passport-jwt')
const { JWT_SECRET } = require('../configs');
const User = require("../models/User");

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
},async (payload, done) =>{
  try {
    console.log('payload ', payload)
    const user = await User.findById(payload.sub)

    if(!user) return done(null, false)
    done(null, user)
  } catch (error) {
    done(error, false)
  }
}))


// Passport local
passport.use(new LocalStrategy({
  usernameField: 'email'
},async (email, password, done) =>{
 try {
  const user = await User.findOne({ email })

  if(!user) return done(null, false)
  console.log('password are requested: ', password)
  const isCorrectPassword = await user.isValidPassword(password)

  if(!isCorrectPassword) return done(null, false)

  done(null, user)
 } catch (error) {
   done(error, false)
 }
}))