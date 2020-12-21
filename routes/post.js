const express = require('express')
// const router = express.Router()
const router = require('express-promise-router')()

const PostController = require('../controllers/post')

const { validateBody, validateParam, schemas, ValidateQuery } = require('../helpers/routerHelpers')

router.route('/')
    .get(PostController.index)
    .post(validateBody(schemas.newPostSchema), PostController.newPost)


router.route('/:postID')
    .get(validateParam(schemas.idSchema, 'postID'), PostController.getPost)
    .put(validateParam(schemas.idSchema, 'postID'), validateBody(schemas.newPostSchema), PostController.replacePost)
    .patch(validateParam(schemas.idSchema, 'postID'), validateBody(schemas.postOptionalSchema), PostController.updatePost)
    .delete(validateParam(schemas.idSchema, 'postID'), PostController.deletePost)

router.route('/:postID/likes')
    .get(validateParam(schemas.idSchema, 'postID'), ValidateQuery(schemas.searchQuerySchema, 'page'), PostController.getLikesInPost)

router.route("/:postID/likes/:userID")
    .get(validateParam(schemas.idSchema, 'postID'), validateParam(schemas.idSchema, 'userID'), PostController.checkLikeStatus)  
    
router.route("/:postID/comments")
    .get(validateParam(schemas.idSchema, 'postID'), ValidateQuery(schemas.searchQuerySchema, 'page'), PostController.getCommentsInPost) 

module.exports = router