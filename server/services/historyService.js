const { History, User, Game, Rank, Profile } = require("../models/models")

class HistoryService {
	constructor() { }

	getHistory = async () => {
		return await History.findAll({
			include: [{ model: Game, attributes: ['name'] }, { model: User, attributes: ['username'], include: [{ model: Profile, attributes: ['rankId'], include: [{ model: Rank, attributes: ['name'] }] }] }],
			order: [['id', 'DESC']]
		})
	}
}

module.exports = new HistoryService()
