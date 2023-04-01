const Router = require('express')
const router = new Router()
const HistoryController = require('../controllers/historyController')

router.get('/get', HistoryController.getHistory)

module.exports = router
