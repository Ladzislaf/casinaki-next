const ApiError = require('../error/ApiError')
const { validatePromo } = require('../validator')
const AppService = require('../services/appService')

class AppController {
	async getRanks(req, res, next) {
		try {
			return res.json({ ranks: await AppService.getRanks() })
		} catch (error) {
			return next(ApiError.badRequest(error.message))
		}
	}

	async applyPromo(req, res, next) {
		const { error } = validatePromo(req.body)
		if (error) {
			console.log(error)
			return next(ApiError.badRequest('Invalid request' + error.details[0].message))
		}
		try {
			return res.json({ result: await AppService.applyPromo(req.body.promocode, req.user.id) })
		} catch (error) {
			return next(ApiError.badRequest(error.message))
		}
	}
}

module.exports = new AppController()
