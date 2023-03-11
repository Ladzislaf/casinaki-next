const uuid = require('uuid')
// const path = require('path')
const { UserProfile } = require('../models/models')
const ApiError = require('../error/ApiError')

class ProfileController {
	async create(req, res, next) {
		try {
			const { user_id } = req.body
			let fileName = uuid.v4() + '.jpg'
			// image.mv(path.resolve(__dirname, '..', 'static', fileName))
			const profile = await UserProfile.create({ user_id, image: fileName, balance })
			return res.json(profile)
		} catch (e) {
			next(ApiError.badRequest(e.message))
		}
	}
	
	async getOne(req, res) {
		res.json({ message: 'get one' })
	}
}

module.exports = new ProfileController()
