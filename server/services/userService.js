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
		const profile = await Profile.create({ userId: user.id, rankId: 1, balance: 0 })
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
		const checkUser = await User.findOne({ where: { id: user.id } })
		const profile = await Profile.findOne({ where: { userId: user.id } })
		const rank = await Rank.findOne({ where: { id: profile.rankId } })
		return generateToken(checkUser.id, checkUser.username, checkUser.role, profile.balance, profile.winnings_sum, rank.name)
	}

	changeUsername = async (user, newUsername) => {
		let candidate = await User.findOne({ where: { username: newUsername } })
		if (candidate) {
			throw new Error(`User with username ${newUsername} is already exists`)
		}
		await User.update({ username: newUsername }, { where: { id: user.id } })
		return this.checkUser(user)
	}

	getUsersList = async () => {
		return await User.findAll({
			// include: [{ model: Game, attributes: ['name'] }, { model: User, attributes: ['username'], include: [{ model: Profile, attributes: ['rankId'], include: [{ model: Rank, attributes: ['name'] }] }] }],
			order: [['id', 'ASC']]
		})
	}

	blockUser = async (userId) => {
		const user = await User.findOne({ where: { id: userId } })
		if (!user) {
			throw new Error(`User with id ${userId} not found`)
		}
		if (user.role === 'BLOCKED') {
			user.update({role: 'USER'})
			return `user ${user.username} unblocked`
		} else if (user.role === 'USER') {
			user.update({role: 'BLOCKED'})
			return `user ${user.username} blocked`
		} else if (user.role === 'ADMIN') {
			return `user ${user.username} is admin, can not block`
		}
	}
	
	getBonus = async (user) => {
		const foundUser = await User.findOne({ where: { id: user.id } })
		const profile = await Profile.findOne({ where: { userId: user.id } })

		if (new Date(foundUser.bonus).toLocaleDateString() === new Date().toLocaleDateString()) {
			return `you already activated bonus today`
		} else {
			foundUser.update({ bonus: Date.now() })
			profile.update({ balance: profile.balance + 1 })
			return `success! you earned 1$`
		}
	}
}

module.exports = new UserService()
