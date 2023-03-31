const { Rank } = require("../models/models")

class AppService {
	constructor() { }

	getRanks = async () => {
		return await Rank.findAll()
	}
}

module.exports = new AppService()
