const Joi = require('joi')

const validator = (schema) => (payload) => schema.validate(payload)

const signInUpSchema = Joi.object({
	username: Joi.string().alphanum().min(6).max(20).required(),
	password: Joi.string().min(8).required()
})

const checkUserSchema = Joi.object({
	user: {
		id: Joi.number().min(1).required(),
		username: Joi.string().alphanum().min(6).max(20).required(),
		role: Joi.string().valid('USER', 'ADMIN').required()
	}
})

const diceSchema = Joi.object({
	bet: Joi.number().min(0.1).max(999999).required(),
	currentDice: Joi.number().min(3).max(11).required(),
	gameMode: Joi.string().valid('over', 'under').required()
})

const hilowSchema = Joi.object({
	info: {
		bet: Joi.number().min(0.1).max(999999),
		card: Joi.number().min(0).max(51),
		mode: Joi.string().valid('high', 'low')
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

const promocodeSchema = Joi.object({
	promocode: Joi.string().alphanum().min(3).max(20).required()
})

module.exports = {
	validateSignInUp: validator(signInUpSchema),
	validateCheckUser: validator(checkUserSchema),
	validateDice: validator(diceSchema),
	validateHilow: validator(hilowSchema),
	validateMiner: validator(minerSchema),
	validatePromo: validator(promocodeSchema),
}
