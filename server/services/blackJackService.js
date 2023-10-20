const { Profile } = require("../models/models")
const { MIN_CARD, MAX_CARD } = require("../utils/constants")
const { getRand, generateToken } = require("../utils/functions")

class BlackJackService {
    constructor() {}

    async startGame(parameters, user) {
        const profile = await Profile.findOne({ where: { userId: user.id } })
		if (parameters.bet && profile.balance < parameters.bet) throw new Error('You don\'t have enough money, go to work, bro)')

        const newBalance = +((profile.balance - parameters.bet).toFixed(2))
        await profile.update({ balance: newBalance })
        const token = generateToken(user.id, user.username, user.role, newBalance)

        return { token, cards: [getRand(MIN_CARD, MAX_CARD), getRand(MIN_CARD, MAX_CARD)] }
    }


}

module.exports = new BlackJackService()
