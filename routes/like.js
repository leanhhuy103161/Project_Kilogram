const express = require('express')
// const router = express.Router()
const router = require('express-promise-router')()

const LikeController = require('../controllers/like')

const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers')

const passport = require('passport')
const passportConfig = require('../middlewares/passport')

router.route('/')
    .get(LikeController.index)
    .post(validateBody(schemas.newLikeSchema), LikeController.newLike)

router.route('/dislike')
    .post(passport.authenticate('jwt', { session: false}), validateBody(schemas.newLikeSchema), LikeController.dislike)

router.route('/:likeID')
    .get(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'likeID'), LikeController.getLike)
    .delete(passport.authenticate('jwt', { session: false}), validateParam(schemas.idSchema, 'likeID'), LikeController.deleteLike)

module.exports = router