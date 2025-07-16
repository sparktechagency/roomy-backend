import express from 'express'
import { ENUM_USER_ROLE } from '../../../enums/enum'
import authentication from '../../middlewares/auth.middleware'
import stripeController from './stripe.controller'

const stripeRouter = express.Router()

stripeRouter.post('/onboard/:id', authentication(ENUM_USER_ROLE.HOST), stripeController.createOnboardLink)

export default stripeRouter