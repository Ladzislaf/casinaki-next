const Router = require('express')
const router = new Router()
const PlayController = require('../controllers/playController')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/dice', authMiddleware, PlayController.playDice)
router.post('/hilow', authMiddleware, PlayController.playHiLow)
router.post('/miner', authMiddleware, PlayController.playMiner)
router.post('/blackjack', authMiddleware, PlayController.playBlackJack)

module.exports = router
