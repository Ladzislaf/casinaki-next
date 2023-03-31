const { validateSignInUp, validateCheckUser } = require('../validator')
const ApiError = require('../error/ApiError')
const UserService = require('../services/userService')

class UserController {
	async registration(req, res, next) {
		const { error } = validateSignInUp(req.body)
		if (error) {
			console.log(error)
			return next(ApiError.badRequest('Invalid request: ' + error.details[0].message))
		}
		const { username, password } = req.body
		try {
			const token = await UserService.registerUser(username, password)
			return res.json({ token })
		} catch (error) {
			return next(ApiError.badRequest(error.message))
		}
	}

	async login(req, res, next) {
		const { error } = validateSignInUp(req.body)
		if (error) {
			console.log(error)
			return next(ApiError.badRequest('Invalid request: ' + error.details[0].message))
		}
		const { username, password } = req.body
		try {
			const token = await UserService.loginUser(username, password)
			return res.json({ token })
		} catch (error) {
			return next(ApiError.badRequest(error.message))
		}
	}

	async check(req, res, next) {
		const { error } = validateCheckUser(req.body)
		if (error) {
			console.log(error)
			return next(ApiError.badRequest('Invalid request: ' + error.details[0].message))
		}
		try {
			const token = await UserService.checkUser(req.user)
			return res.json({ token })
		} catch (error) {
			return next(ApiError.badRequest(error.message))
		}
	}
}

module.exports = new UserController()
