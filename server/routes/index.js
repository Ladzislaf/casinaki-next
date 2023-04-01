const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const historyRouter = require('./historyRouter')
const playRouter = require('./playRouter')
const AppController = require('../controllers/appController')
const authMiddleware = require('../middlewares/authMiddleware')

router.use('/user', userRouter)
router.use('/history', historyRouter)
router.use('/play', playRouter)
router.get('/ranks', AppController.getRanks)
router.post('/promo', authMiddleware, AppController.applyPromo)

module.exports = router
