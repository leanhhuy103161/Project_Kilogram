const express = require('express')
// const router = express.Router()
const router = require('express-promise-router')()

const UserController = require('../controllers/user')

const FollowController = require('../controllers/follow')

const { validateBody, validateParam, ValidateQuery, schemas } = require('../helpers/routerHelpers')

const passport = require('passport')
const passportConfig = require('../middlewares/passport')


router.route('/')
    .get(UserController.index)
    .post(validateBody(schemas.userSchema), UserController.newUser)

router.route('/signup').post(validateBody(schemas.authSignUpSchema), UserController.signUp)

router.route('/signin')
    .post(validateBody(schemas.authSignInSchema), passport.authenticate('local', {session: false}), UserController.signIn)

router.route('/secret').get(passport.authenticate('jwt', { session: false}), UserController.secret)

router.route('/search')
    .post(passport.authenticate('jwt', { session: false}), validateBody(schemas.searchSchema), ValidateQuery(schemas.searchQuerySchema, 'page'), UserController.searchUsers)

router.route('/:userID')
    .get(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'userID'), UserController.getUser)
    .put(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userSchema), UserController.replaceUser)
    .patch(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userOptionalSchema), UserController.updateUser)

router.route('/:userID/posts')
    .get(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'userID'), ValidateQuery(schemas.searchQuerySchema, 'page'), UserController.getUserPosts)
    .post(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'userID'), validateBody(schemas.postSchema), UserController.newUserPost)

router.route('/:userID/follow')
    .get(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'userID'), FollowController.getFollow)

router.route('/:userID/follower')
    .get(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'userID'), FollowController.getFollower) // get all follower and follwing of a user (:userID)
    .post(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userFollowSchema), FollowController.newFollow) //  (:userID) follow someone

router.route('/:userID/following')
    .get(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'userID'), FollowController.getFollowing)
    .post(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userFollowSchema), FollowController.deleteFollow) // (:userID) unfollow someone

router.route('/:yourID/checkfollow/:guestID')
    .get(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'yourID'), validateParam(schemas.idSchema, 'guestID'), FollowController.checkFollowStatus)

module.exports = router