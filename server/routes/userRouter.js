const Router = require('express')
const router = new Router()
const UserController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/registration', UserController.registration)
router.post('/login', UserController.login)
router.get('/auth', authMiddleware, UserController.check)
router.post('/change', authMiddleware, UserController.change)
router.get('/all', authMiddleware, UserController.all)
router.post('/block', authMiddleware, UserController.block)
router.get('/bonus', authMiddleware, UserController.bonus)

module.exports = router
