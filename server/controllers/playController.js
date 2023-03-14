const fs = require('fs')
const ApiError = require('../error/ApiError')
const { Profile, History } = require('../models/models')
const { generateToken, getRand, getCardValue, getCoefficients } = require('../utils/functions')
const { MIN_CARD, MAX_CARD, MIN_DICE, MAX_DICE, overDiceCoefficients, underDiceCoefficients } = require('../utils/constants')

// validation: currentDice: 3..11; mode: 'over' of 'under'
class playController {
	// needs to be refactored; hard to understand
	async playHiLow(req, res, next) {
		const { info } = req.body
		const user = req.user
		const profile = await Profile.findOne({ where: { userId: user.id } })
		if (info.bet && profile.balance < info.bet) return next(ApiError.badRequest('You don\'t have enough money, go to work, bro)'))

		let games = JSON.parse(fs.readFileSync(require.resolve('../static/state.js')))
		let activeGame = games.find(el => el.player === user.id)
		let status = ''
		
		if (info.bet && activeGame) {
			fs.writeFileSync(require.resolve('../static/state.js'), JSON.stringify(games.filter(el => el.player !== user.id)))
			games = JSON.parse(fs.readFileSync(require.resolve('../static/state.js')))
			activeGame = null
		}

		if (!activeGame) {
			activeGame = { player: user.id, bet: info.bet, coefficient: 1, card: info.card }
			games.push(activeGame)
			fs.writeFileSync(require.resolve('../static/state.js'), JSON.stringify(games))
			status = `-${info.bet}$`
			
			const newBalance = +((user.balance - activeGame.bet).toFixed(2))
			await profile.update({ balance: newBalance })
			const token = generateToken(user.id, user.email, user.username, user.role, newBalance)

			const { hCoefficient, lCoefficient } = getCoefficients(getCardValue(activeGame.card))
			
			return res.json({ token, status: status, coefficients: { hCoefficient, lCoefficient } })
		} else if (info.mode) {
			// playing
			const token = generateToken(user.id, user.email, user.username, user.role, user.balance)

			const currentCardValue = getCardValue(activeGame.card)
			let newCard = getRand(MIN_CARD, MAX_CARD)
			while (newCard === activeGame.card) {
				newCard = getRand(MIN_CARD, MAX_CARD)
			}
			const newCardValue = getCardValue(newCard)
			const { hCoefficient, lCoefficient } = getCoefficients(newCardValue)
			if (info.mode === 'high') {
				if ((currentCardValue === 1 && newCardValue > currentCardValue) ||
					(currentCardValue !== 1 && newCardValue >= currentCardValue)) {
					activeGame.coefficient = activeGame.coefficient * getCoefficients(currentCardValue).hCoefficient
					activeGame.card = newCard
					fs.writeFileSync(require.resolve('../static/state.js'), JSON.stringify(games))
					return res.json({ token, coefficients: { hCoefficient, lCoefficient, tCoefficient: activeGame.coefficient }, card: newCard })
				} else {
					await History.create({ bet: activeGame.bet, coefficient: activeGame.coefficient, winnings: `-${activeGame.bet}$`, userId: user.id, gameId: 1 })
					fs.writeFileSync(require.resolve('../static/state.js'), JSON.stringify(games.filter(el => el.player !== user.id)))
					return res.json({ token, card: newCard })
				}
			} else if (info.mode === 'low') {
				if ((currentCardValue === 13 && newCardValue < currentCardValue) ||
					(currentCardValue !== 13 && newCardValue <= currentCardValue)) {
					activeGame.coefficient = activeGame.coefficient * getCoefficients(currentCardValue).lCoefficient
					activeGame.card = newCard
					fs.writeFileSync(require.resolve('../static/state.js'), JSON.stringify(games))
					return res.json({ token, coefficients: { hCoefficient, lCoefficient, tCoefficient: activeGame.coefficient }, card: newCard })
				} else {
					await History.create({ bet: activeGame.bet, coefficient: activeGame.coefficient, winnings: `-${activeGame.bet}$`, userId: user.id, gameId: 1 })
					fs.writeFileSync(require.resolve('../static/state.js'), JSON.stringify(games.filter(el => el.player !== user.id)))
					return res.json({ token, card: newCard })
				}
			}
		} else {
			// cash out
			status = `+${(activeGame.bet * activeGame.coefficient - activeGame.bet).toFixed(2)}`
			fs.writeFileSync(require.resolve('../static/state.js'), JSON.stringify(games.filter(el => el.player !== user.id)))
			const newBalance = +((user.balance + activeGame.bet * activeGame.coefficient).toFixed(2))
			const token = generateToken(user.id, user.email, user.username, user.role, newBalance)
			await History.create({ bet: activeGame.bet, coefficient: activeGame.coefficient.toFixed(2), winnings: status, userId: user.id, gameId: 1 })
			await profile.update({ balance: newBalance })
			return res.json({ token, status})
		}
	}

	async playDice(req, res, next) {
		const { bet, currentDice, gameMode } = req.body
		const user = req.user
		const profile = await Profile.findOne({ where: { userId: user.id } })

		if (profile.balance < bet) return next(ApiError.badRequest('You don\'t have enough money, go to work, bro)'))

		let newDice = getRand(MIN_DICE, MAX_DICE), newBalance, coefficient, gameResult
		if (gameMode.toLowerCase() === 'over') {
			coefficient = overDiceCoefficients[currentDice - 2]
			if (newDice > currentDice) {
				gameResult = `+${(bet * coefficient - bet).toFixed(2)}$`
				newBalance = +((user.balance - bet + bet * coefficient).toFixed(2))
			} else {
				gameResult = `-${bet}$`
				newBalance = +((user.balance - bet).toFixed(2))
			}
		} else if (gameMode.toLowerCase() === 'under') {
			coefficient = underDiceCoefficients[currentDice - 2]
			if (newDice < currentDice) {
				gameResult = `+${(bet * coefficient - bet).toFixed(2)}$`
				newBalance = +((user.balance - bet + bet * coefficient).toFixed(2))
			} else {
				gameResult = `-${bet}$`
				newBalance = +((user.balance - bet).toFixed(2))
			}
		}

		await History.create({ bet, coefficient, winnings: gameResult, userId: user.id, gameId: 2 })
		await profile.update({ balance: newBalance })
		const token = generateToken(user.id, user.email, user.username, user.role, newBalance)
		return res.json({ token, diceResult: newDice, gameResult: gameResult })
	}
}

module.exports = new playController()
