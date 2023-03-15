const { forbidden } = require('joi')
const Joi = require('joi')

const validator = (schema) => (payload) => schema.validate(payload)

const sighUpSchema = Joi.object({
	email: Joi.string().email().required(),
	username: Joi.string().min(6).max(20).required(),
	password: Joi.string().min(8).required()
})

const sighInSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(8).required()
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

module.exports = {
	validateSignUp: validator(sighUpSchema),
	validateSignIn: validator(sighInSchema),
	validateDice: validator(diceSchema),
	validateHilow: validator(hilowSchema),
	validateMiner: validator(minerSchema),
}
