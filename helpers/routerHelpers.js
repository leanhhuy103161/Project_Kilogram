const Joi = require('@hapi/joi')
const { schema } = require('../models/Deck')

const validateBody = (schema) => {
  return (req, res, next) => {
    const validatorResult = schema.validate(req.body)

    if (validatorResult.error) {
      return res.status(400).json(validatorResult.error)
    } else {
      if (!req.value) req.value = {}
      if (!req.value['params']) req.value.params = {}

      req.value.body = validatorResult.value
      next()
    }
  }
}

const validateParam = (schema, name) => {
  return (req, res, next) => {
    const validatorResult = schema.validate({param: req.params[name]})

    if (validatorResult.error) {
      return res.status(400).json(validatorResult.error)
    } else {
      if (!req.value) req.value = {}
      if (!req.value['params']) req.value.params = {}

      req.value.params[name] = req.params[name]
      next()
    }
  }
}

const ValidateQuery = (schema, queryString) => {
  return (req, res, next) => {
    var validatorResult = schema.validate({page: req.query[queryString]})
    if (validatorResult.error) {
      return res.status(400).json(validatorResult.error)
    } else {
      if (!req.value) req.value = {}
      if (!req.value['query']) req.value.query = {}

      req.value.query[queryString] = req.query[queryString]
      next()
    }
  }
}

const schemas = {
  authSignInSchema: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  authSignUpSchema: Joi.object().keys({
    avatar: Joi.string(),
    userName: Joi.string().regex(/^[0-9a-zA-Z]{3,30}$/),
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  userFollowSchema: Joi.object().keys({
    following: Joi.string().regex(/^[a-f0-9A-F]{24}$/)
  }),

  searchSchema: Joi.object().keys({
    userName: Joi.string()
  }),

  searchQuerySchema: Joi.object().keys({
    page: Joi.string().regex(/^[0-9]{1,100}$/)
  }),
  
  deckSchema: Joi.object().keys({
    name: Joi.string().min(6).required(),
    description: Joi.string().min(10).required()
  }),

  postSchema: Joi.object().keys({
    image: Joi.string().required(),
    description: Joi.string().required()
  }),

  deckOptionalSchema: Joi.object().keys({
    name: Joi.string().min(6),
    description: Joi.string().min(10),
    owner: Joi.string().regex(/^[a-f0-9A-F]{24}$/)
  }),

  idSchema: Joi.object().keys({
    param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),

  newDeckSchema: Joi.object().keys({
    name: Joi.string().min(6).required(),
    description: Joi.string().min(10).required(),
    owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),

  newLikeSchema: Joi.object().keys({
    userLiked: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    postIsLiked: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),

  newPostSchema: Joi.object().keys({
    description: Joi.string().min(10).required(),
    owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    image: Joi.string().required()
  }),

  userSchema: Joi.object().keys({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  userOptionalSchema: Joi.object().keys({
    firstName: Joi.string().min(2),
    lastName: Joi.string().min(2),
    email: Joi.string().email()
  })
}

module.exports = {
    validateBody,
    validateParam,
    ValidateQuery,
    schemas
}