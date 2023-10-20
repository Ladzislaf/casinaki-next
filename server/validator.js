const Joi = require('joi')

const validator = (schema) => (payload) => schema.validate(payload)

const signInUpSchema = Joi.object({
	username: Joi.string().trim().alphanum().min(6).max(20).required(),
	password: Joi.string().trim().min(8).required()
})

const checkUserSchema = Joi.object({
	user: {
		id: Joi.number().min(1).required(),
		username: Joi.string().trim().alphanum().min(6).max(20).required(),
		role: Joi.string().trim().valid('USER', 'ADMIN').required()
	}
})

const changeUserSchema = Joi.object({
	newUsername: Joi.string().trim().alphanum().min(6).max(20).required()
})

const blockUserSchema = Joi.object({
	userId: Joi.number().min(1).required()
})

const diceSchema = Joi.object({
	bet: Joi.number().min(0.1).max(999999).required(),
	currentDice: Joi.number().min(3).max(11).required(),
	gameMode: Joi.string().trim().valid('over', 'under').required()
})

const hilowSchema = Joi.object({
	info: {
		bet: Joi.number().min(0.1).max(999999),
		card: Joi.number().min(0).max(51),
		mode: Joi.string().trim().valid('high', 'low')
			.when('bet', { is: Joi.exist(), then: Joi.forbidden() })
	}
})

const minerSchema = Joi.object({
	info: {
		bet: Joi.number().min(0.1).max(999999),
		bombsCount: Joi.number().min(1).max(24)
			.when('bet', { is: Joi.exist(), then: Joi.required() }),
		cellNumber: Joi.number().min(1).max(25)
			.when('bet', { is: Joi.exist(), then: Joi.forbidden() })
	}
})

const blackJackSchema = Joi.object({
	parameters: {
		bet: Joi.number().min(0.1).max(999999),
	}
})

const promocodeSchema = Joi.object({
	promocode: Joi.string().trim().alphanum().min(3).max(20).required()
})

const reviewSchema = Joi.object({
	review: Joi.string().trim().min(3).max(300).required()
})

module.exports = {
	validateSignInUp: validator(signInUpSchema),
	validateCheckUser: validator(checkUserSchema),
	validateChangeUser: validator(changeUserSchema),
	validateBlockUser: validator(blockUserSchema),
	validateDice: validator(diceSchema),
	validateHilow: validator(hilowSchema),
	validateMiner: validator(minerSchema),
	validateBlackJack: validator(blackJackSchema),
	validatePromo: validator(promocodeSchema),
	validateReview: validator(reviewSchema),
}
