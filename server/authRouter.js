const Router = require('express')
const router = new Router()
const controller = require('./authController')
const { check } = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')

router.post('/registration', [
	check('username', 'Username can\'t be empty').notEmpty(),
	check('password', 'Password need\'s to be longer than 8 symbols').isLength({ min: 8, max: 20 })
], controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware('USER'), controller.getUsers)

module.exports = router
