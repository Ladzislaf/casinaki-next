const Router = require('express')
const router = new Router()
const PlayController = require('../controllers/playController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/dice', authMiddleware, PlayController.playDice)
router.post('/hilow', authMiddleware, PlayController.playHiLow)
router.post('/miner', authMiddleware, PlayController.playMiner)

module.exports = router
