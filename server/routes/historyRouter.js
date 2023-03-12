const Router = require('express')
const router = new Router()
const HistoryController = require('../controllers/historyController')

router.get('/get', HistoryController.getHistory)
router.post('/add', HistoryController.appendHistory)

module.exports = router
