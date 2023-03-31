const ApiError = require('../error/ApiError')
const AppService = require('../services/appService')

class AppController {
	async getRanks(req, res, next) {
		try {
			return res.json({ ranks: await AppService.getRanks() })
		} catch (error) {
			return next(ApiError.badRequest(error.message))
		}
	}
}

module.exports = new AppController()
