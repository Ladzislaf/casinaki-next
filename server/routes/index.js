const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const historyRouter = require('./historyRouter')
const playRouter = require('./playRouter')

router.use('/user', userRouter)
router.use('/history', historyRouter)
router.use('/play', playRouter)

module.exports = router
