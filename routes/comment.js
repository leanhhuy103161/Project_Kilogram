const express = require('express')
// const router = express.Router()
const router = require('express-promise-router')()

const CommentController = require('../controllers/comment')

const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers')

const passport = require('passport')
const passportConfig = require('../middlewares/passport')

router.route('/')
    .get(CommentController.index)
    .post(passport.authenticate('jwt', { session: false}), validateBody(schemas.newCommentSchema), CommentController.newComment)

    
router.route('/:commentID')
    .get(validateParam(schemas.idSchema, 'commentID'), CommentController.getComment)
    .put(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'commentID'), validateBody(schemas.newCommentSchema), CommentController.replaceComment)
    .patch(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'commentID'), validateBody(schemas.commentOptionalSchema), CommentController.updateComment)
    .delete(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'commentID'), CommentController.deleteComment)
    

module.exports = router