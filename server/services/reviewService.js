const { Review, User } = require("../models/models")

class ReviewService {
	constructor() { }

    getReviews = async () => {
		return await Review.findAll({
            include: { model: User, attributes: ['username']}
        })
    }

	writeReview = async (userId, text) => {
		await Review.findOne({ where: { userId: userId } })
			.then(async (review) => {
				if (review) {
					await review.update({ text: text })
				} else {
					console.log(text)
					await Review.create({ userId: userId, text: text })
				}
			})
		return await this.getReviews()
	}

	deleteReview = async (userId) => {
		await Review.destroy({ where: { userId: userId } })
		return await this.getReviews()
	}
}

module.exports = new ReviewService()
