const ApiError = require('../error/ApiError')
const { History, Game, User } = require('../models/models')

class historyController {
	async getHistory(req, res, next) {
		const allBets = await History.findAll({ 
			include: [{ model: Game, attributes: ['name'] }, { model: User, attributes: ['username'] }], 
			order: [['id', 'DESC']] 
		})
		return res.json({ history: allBets })
	}

	async appendHistory(req, res, next) {
		const { bet, coefficient, winnings, userId, gameId } = req.body
		await History.create({ bet, coefficient, winnings, userId, gameId })
		return res.json({ message: 'history updated' })
	}
}

module.exports = new historyController()
