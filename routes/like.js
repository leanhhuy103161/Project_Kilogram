const express = require('express')
// const router = express.Router()
const router = require('express-promise-router')()

const LikeController = require('../controllers/like')

const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers')

router.route('/')
    .get(LikeController.index)
    .post(validateBody(schemas.newLikeSchema), LikeController.newLike)

router.route('/:likeID')
    .get(validateParam(schemas.idSchema, 'likeID'), LikeController.getLike)
    .delete(validateParam(schemas.idSchema, 'likeID'), LikeController.deleteLike)

module.exports = router