const { validateSignInUp, validateCheckUser, validateChangeUser, validateBlockUser } = require('../validator')
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

	async change(req, res, next) {
		const { error } = validateChangeUser(req.body)
		if (error) {
			console.log(error)
			return next(ApiError.badRequest('Invalid request: ' + error.details[0].message))
		}
		try {
			const token = await UserService.changeUsername(req.user, req.body.newUsername)
			return res.json({ token })
		} catch (error) {
			return next(ApiError.badRequest(error.message))
		}
	}

	async all(req, res, next) {
		try {
			return res.json({ usersList: await UserService.getUsersList() })
		} catch (error) {
			return next(ApiError.badRequest(error.message))
		}
	}

	async block(req, res, next) {
		const { error } = validateBlockUser(req.body)
		if (error) {
			console.log(error)
			return next(ApiError.badRequest('Invalid request: ' + error.details[0].message))
		}
		try {
			return res.json({ info: await UserService.blockUser(req.body.userId) })
		} catch (error) {
			return next(ApiError.badRequest(error.message))
		}
	}

	async bonus(req, res, next) {
		try {
			return res.json({ info: await UserService.getBonus(req.user) })
		} catch (error) {
			return next(ApiError.badRequest(error.message))
		}
	}
}

module.exports = new UserController()
