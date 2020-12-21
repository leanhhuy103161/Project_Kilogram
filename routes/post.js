const express = require('express')
// const router = express.Router()
const router = require('express-promise-router')()

const PostController = require('../controllers/post')

const { validateBody, validateParam, schemas, ValidateQuery } = require('../helpers/routerHelpers')

const passport = require('passport')
const passportConfig = require('../middlewares/passport')

router.route('/')
    .get(PostController.index)
    .post(validateBody(schemas.newPostSchema), PostController.newPost)

router.route('/:postID')
    .get(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'postID'), PostController.getPost)
    .put(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'postID'), validateBody(schemas.newPostSchema), PostController.replacePost)
    .patch(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'postID'), validateBody(schemas.postOptionalSchema), PostController.updatePost)
    .delete(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'postID'), PostController.deletePost)

router.route('/:postID/likes')
    .get(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'postID'), ValidateQuery(schemas.searchQuerySchema, 'page'), PostController.getLikesInPost)

router.route("/:postID/likes/:userID")
    .get(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'postID'), validateParam(schemas.idSchema, 'userID'), PostController.checkLikeStatus)  
    
router.route("/:postID/comments")
    .get(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'postID'), ValidateQuery(schemas.searchQuerySchema, 'page'), PostController.getCommentsInPost) 

module.exports = router