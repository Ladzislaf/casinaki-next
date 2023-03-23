const { History, User, Game } = require("../models/models")

class HistoryService {
	constructor() { }

	getHistory = async () => {
		return await History.findAll({
			include: [{ model: Game, attributes: ['name'] }, { model: User, attributes: ['username'] }],
			order: [['id', 'DESC']]
		})
	}
}

module.exports = new HistoryService()
