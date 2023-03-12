const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const historyRouter = require('./historyRouter')

router.use('/user', userRouter)
router.use('/history', historyRouter)

module.exports = router
