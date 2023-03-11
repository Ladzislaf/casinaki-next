const ApiError = require('../error/ApiError')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Profile } = require('../models/models')

const generateToken = (id, email, username, role, balance) => {
	return jwt.sign(
		{ id, email, username, role, balance },
		process.env.SECRET_KEY,
		{ expiresIn: '24h' }
	)
}

// todo validation !!! 
class UserController {
	async registration(req, res, next) {
		const { email, username, password, role } = req.body
		if (!email || !password)
			return next(ApiError.badRequest('Incorrect email or password'))
		if (!username)
			return next(ApiError.badRequest('Incorrect username'))
		const candidate = await User.findOne({ where: { email } })
		if (candidate) {
			return next(ApiError.badRequest('User with the same email is already exists'))
		}
		const hashPassword = await bcrypt.hash(password, 5)
		const user = await User.create({ email, username, password: hashPassword, role })
		await Profile.create({ userId: user.id })
		const token = generateToken(user.id, user.email, user.username, user.role, 5)
		return res.json({ token })
	}

	async login(req, res, next) {
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

	async setUser(req, res, next) {
		const { balance } = req.body
		const user = await User.findOne({ where: { email: req.user.email } })
		if (!user) {
			return next(ApiError.badRequest(`User with email ${email} not found`))
		}
		const profile = await Profile.findOne({ userId: user.id })
		await profile.update({ balance: balance })
		const token = generateToken(req.user.id, req.user.email, req.user.username, req.user.role, balance)
		return res.json({ token })
	}
}

module.exports = new UserController()
