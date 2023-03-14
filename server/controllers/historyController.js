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
}

module.exports = new historyController()
