const ApiError = require('../error/ApiError')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Profile } = require('../models/models')

const generateToken = (id, email, role) => {
	return jwt.sign(
		{ id, email, role },
		process.env.SECRET_KEY,
		{ expiresIn: '24h' }
	)
}

// todo validation !!! from short video
class UserController {
	async registration(req, res, next) {
		const { email, password, role } = req.body
		if (!email || !password) {
			return next(ApiError.badRequest('Incorrect email or password'))
		}
		const candidate = await User.findOne({ where: { email } })
		if (candidate) {
			return next(ApiError.badRequest('User with the same email is already exists'))
		}
		const hashPassword = await bcrypt.hash(password, 5)
		const user = await User.create({ email, password: hashPassword, role })
		await Profile.create({ userId: user.id })
		const token = generateToken(user.id, user.email, user.role)
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
		const token = generateToken(user.id, user.email, user.role)
		return res.json({ token })
	}

	async check(req, res, next) {
		const token = generateToken(req.user.id, req.user.email, req.user.role)
		return res.json({ token })
	}
}

module.exports = new UserController()
