const express = require('express')
// const router = express.Router()
const router = require('express-promise-router')()

const CommentController = require('../controllers/comment')

const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers')

router.route('/')
    .get(CommentController.index)
    .post(validateBody(schemas.newCommentSchema), CommentController.newComment)

    
router.route('/:commentID')
    .get(validateParam(schemas.idSchema, 'commentID'), CommentController.getComment)
    .put(validateParam(schemas.idSchema, 'commentID'), validateBody(schemas.newCommentSchema), CommentController.replaceComment)
    .patch(validateParam(schemas.idSchema, 'commentID'), validateBody(schemas.commentOptionalSchema), CommentController.updateComment)
    .delete(validateParam(schemas.idSchema, 'commentID'), CommentController.deleteComment)
    

module.exports = router