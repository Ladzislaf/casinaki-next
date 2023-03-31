const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const historyRouter = require('./historyRouter')
const playRouter = require('./playRouter')
const AppController = require('../controllers/appController')

router.use('/user', userRouter)
router.use('/history', historyRouter)
router.use('/play', playRouter)
router.use('/ranks', AppController.getRanks)

module.exports = router
