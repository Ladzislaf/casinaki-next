const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { secret } = require('./config')

const generateAccessToken = (id, role) => {
	const payload = { id, role }
	return jwt.sign(payload, secret, { expiresIn: '24h' })
}

class authController {
	async registration(req, res) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({ message: 'Registration error', errors })
			}
			const { username, password } = req.body
			const candidate = await User.findOne({ username })
			if (candidate) {
				return res.status(400).json({ message: 'User with the same name is already exists' })
			}
			const hashPassword = bcrypt.hashSync(password, 5)
			const userRole = await Role.findOne({ value: 'ADMIN' })
			const user = new User({ username, password: hashPassword, role: userRole.value })
			await user.save()
			return res.json({ message: 'User successfully registered' })
		} catch (e) {
			console.log(e)
			res.status(400).json({ message: 'Registration error' })
		}
	}

	async login(req, res) {
		try {
			const { username, password } = req.body
			const user = await User.findOne({ username })
			if (!user) {
				return res.status(404).json({ message: `User ${username} not found` })
			}
			const validPassword = bcrypt.compareSync(password, user.password)
			if (!validPassword) {
				return res.status(400).json({ message: 'Invalid password' })
			}
			const token = generateAccessToken(user._id, user.role)
			return res.json({ token })
		} catch (e) {
			console.log(e)
			res.status(400).json({ message: 'Login error' })
		}
	}

	async getUsers(req, res) {
		try {
			const users = await User.find()
			res.json(users)
		} catch (e) {
			console.log(e)
		}
	}
}

module.exports = new authController()