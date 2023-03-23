const bcrypt = require('bcryptjs')

const { User, Profile } = require("../models/models")
const { generateToken } = require('../utils/functions')

class UserService {
	constructor() { }

	registerUser = async (email, username, password) => {
		let candidate = await User.findOne({ where: { email } })
		if (candidate) {
			throw new Error(`User with email ${email} is already exists`)
		}
		candidate = await User.findOne({ where: { username } })
		if (candidate) {
			throw new Error(`User with username ${username} is already exists`)
		}
		const hashPassword = await bcrypt.hash(password, 5)
		const user = await User.create({ email, username, password: hashPassword, role: 'USER' })
		const profile = await Profile.create({ userId: user.id, balance: 5 })
		return generateToken(user.id, user.email, user.username, user.role, profile.balance)
	}

	loginUser = async (email, password) => {
		const user = await User.findOne({ where: { email: email } })
		if (!user) {
			throw new Error(`User with email ${email} not found`)
		}
		let comparePassword = bcrypt.compareSync(password, user.password)
		if (!comparePassword) {
			throw new Error('Incorrect password')
		}
		const profile = await Profile.findOne({ where: { userId: user.id } })
		return generateToken(user.id, user.email, user.username, user.role, profile.balance)
	}

	checkUser = async (user) => {
		const profile = await Profile.findOne({ where: { userId: user.id } })
		return generateToken(user.id, user.email, user.username, user.role, profile.balance)
	}
}

module.exports = new UserService()
