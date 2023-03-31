const ApiError = require('../error/ApiError')
const { validateHilow, validateDice, validateMiner } = require('../validator')
const PlayService = require('../services/playService')

class PlayController {
	async playHiLow(req, res, next) {
		const { error } = validateHilow(req.body)
		if (error) {
			console.log(error)
			return next(ApiError.badRequest('Invalid request: ' + error.details[0].message))
		}
		const { info } = req.body
		const user = req.user

		try {
			const result = await PlayService.playHiLow(info, user)
			return res.json(result)
		} catch (error) {
			return next(ApiError.badRequest(error.message))
		}
	}

	async playDice(req, res, next) {
		const { error } = validateDice(req.body)
		if (error) {
			console.log(error)
			return next(ApiError.badRequest('Invalid request: ' + error.details[0].message))
		}
		const { bet, currentDice, gameMode } = req.body
		const user = req.user

		try {
			const result = await PlayService.playDice(bet, currentDice, gameMode, user)
			return res.json(result)
		} catch (error) {
			return next(ApiError.badRequest(error.message))
		}
	}

	async playMiner(req, res, next) {
		const { error } = validateMiner(req.body)
		if (error) {
			console.log(error)
			return next(ApiError.badRequest('Invalid request' + error.details[0].message))
		}
		const { info } = req.body
		const user = req.user

		try {
			const result = await PlayService.playMiner(info, user)
			return res.json(result)
		} catch (error) {
			return next(ApiError.badRequest(error.message))
		}
	}
}

module.exports = new PlayController()
