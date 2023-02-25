const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
// const profileRouter = require('./profileRouter')

router.use('/user', userRouter)
// router.use('/profile', profileRouter)

module.exports = router
