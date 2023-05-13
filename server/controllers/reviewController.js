const ApiError = require('../error/ApiError')
const { validateReview } = require('../validator')
const ReviewService = require('../services/reviewService')

class ReviewController {
    async getReviews(req, res, next) {
        try {
            return res.json({ allReviews: await ReviewService.getReviews() })
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }

	async writeReview(req, res, next) {
        const { error } = validateReview(req.body)
        if (error) {
            console.log(error)
            return next(ApiError.badRequest('Invalid request' + error.details[0].message))
        }
        try {
            return res.json({ allReviews: await ReviewService.writeReview(req.user.id, req.body.review) })
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }

    async deleteReview(req, res, next) {
        try {
            return res.json({ allReviews: await ReviewService.deleteReview(req.user.id) })
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new ReviewController()
