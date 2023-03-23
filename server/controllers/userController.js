const { validateSignUp, validateSignIn, validateCheckUser } = require('../validator')
const ApiError = require('../error/ApiError')
const UserService = require('../services/userService')

class UserController {
	async registration(req, res, next) {
		const { error } = validateSignUp(req.body)
		if (error) {
			console.log(error)
			return next(ApiError.badRequest('Invalid request: ' + error.details[0].message))
		}
		const { email, username, password } = req.body

		try {
			const token = await UserService.registerUser(email, username, password)
			return res.json({ token })
		} catch (error) {
			return next(ApiError.badRequest(error.message))
		}
	}

	async login(req, res, next) {
		const { error } = validateSignIn(req.body)
		if (error) {
			console.log(error)
			return next(ApiError.badRequest('Invalid request: ' + error.details[0].message))
		}
		const { email, password } = req.body

		try {
			const token = await UserService.loginUser(email, password)
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

	async getProfile(req, res, next) {

		return res.json({})
	}
}

module.exports = new UserController()
