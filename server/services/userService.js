const bcrypt = require('bcryptjs')

const { User, Profile, Rank } = require("../models/models")
const { generateToken } = require('../utils/functions')

class UserService {
	constructor() { }

	registerUser = async (username, password) => {
		let candidate = await User.findOne({ where: { username } })
		if (candidate) {
			throw new Error(`User with username ${username} is already exists`)
		}
		const hashPassword = await bcrypt.hash(password, 5)
		const user = await User.create({ username, password: hashPassword, role: 'USER' })
		const profile = await Profile.create({ userId: user.id, rankId: 1, balance: 5 })
		return generateToken(user.id, user.username, user.role, profile.balance, 0, 'noob')
	}

	loginUser = async (username, password) => {
		const user = await User.findOne({ where: { username } })
		if (!user) {
			throw new Error(`User with username ${username} not found`)
		}
		let comparePassword = bcrypt.compareSync(password, user.password)
		if (!comparePassword) {
			throw new Error('Incorrect password')
		}
		const profile = await Profile.findOne({ where: { userId: user.id } })
		const rank = await Rank.findOne({ where: { id: profile.rankId } })
		return generateToken(user.id, user.username, user.role, profile.balance, profile.winnings_sum, rank.name)
	}

	checkUser = async (user) => {
		const profile = await Profile.findOne({ where: { userId: user.id } })
		const rank = await Rank.findOne({ where: { id: profile.rankId } })
		return generateToken(user.id, user.username, user.role, profile.balance, profile.winnings_sum, rank.name)
	}
}

module.exports = new UserService()
