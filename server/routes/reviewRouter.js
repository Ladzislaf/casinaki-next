const Router = require('express')
const router = new Router()
const ReviewController = require('../controllers/reviewController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/get', ReviewController.getReviews)
router.post('/write', authMiddleware, ReviewController.writeReview)
router.post('/delete', authMiddleware, ReviewController.deleteReview)

module.exports = router
