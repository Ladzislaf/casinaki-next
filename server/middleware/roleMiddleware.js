const jwt = require('jsonwebtoken')
const { secret } = require('../config')

module.exports = function (role) {
	return async function (req, res, next) {
		if (req.method === 'OPTIONS') {
			next()
		}

		try {
			const token = req.headers.authorization.split(' ')[1]
			if (!token) {
				return res.status(403).json({ message: 'User is not authorized' })
			}
			const { role: userRole } = jwt.verify(token, secret)
			let hasRole = false
			if (userRole === role) {
				hasRole = true
			}
			if (!hasRole) {
				return res.status(403).json({ message: 'You don\'t have a permission' })
			}
			next()
		} catch (e) {
			console.log(e)
			return res.status(403).json({ message: 'User authorization error' })
		}
	}
}