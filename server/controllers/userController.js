const ApiError = require('../error/ApiError')
const bcrypt = require('bcryptjs')
const { User, Profile } = require('../models/models')
const { validateSignUp, validateSignIn } = require('../validator')
const { generateToken } = require('../utils/functions')

class UserController {
	async registration(req, res, next) {
		const { error } = validateSignUp(req.body)
		if (error) {
			console.log(error)
			return next(ApiError.badRequest('Invalid request: ' + error.details[0].message))
		}
		const { email, username, password } = req.body
		let candidate = await User.findOne({ where: { email } })
		if (candidate) {
			return next(ApiError.badRequest('User with the same email is already exists'))
		}
		candidate = await User.findOne({ where: { username } })
		if (candidate) {
			return next(ApiError.badRequest('User with the same username is already exists'))
		}
		const hashPassword = await bcrypt.hash(password, 5)
		const user = await User.create({ email, username, password: hashPassword, role: 'USER' })
		const profile = await Profile.create({ userId: user.id, balance: 5 })
		const token = generateToken(user.id, user.email, user.username, user.role, profile.balance)
		return res.json({ token })
	}

	async login(req, res, next) {
		const { error } = validateSignIn(req.body)
		if (error) {
			console.log(error)
			return next(ApiError.badRequest('Invalid request: ' + error.details[0].message))
		}
		const { email, password } = req.body
		const user = await User.findOne({ where: { email } })
		if (!user) {
			return next(ApiError.badRequest(`User with email ${email} not found`))
		}
		let comparePassword = bcrypt.compareSync(password, user.password)
		if (!comparePassword) {
			return next(ApiError.badRequest('Incorrect password'))
		}
		const profile = await Profile.findOne({ where: { userId: user.id } })
		const token = generateToken(user.id, user.email, user.username, user.role, profile.balance)
		return res.json({ token })
	}

	async check(req, res, next) {
		const token = generateToken(req.user.id, req.user.email, req.user.username, req.user.role, req.user.balance)
		return res.json({ token })
	}
}

module.exports = new UserController()
