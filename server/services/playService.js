const fs = require('fs')
const { History, Profile, Rank } = require("../models/models")
const { generateToken, getRand, getCardValue, getCoefficients, getBombs, calculateCoefficient, updateRank } = require('../utils/functions')
const { MIN_CARD, MAX_CARD, MIN_DICE, MAX_DICE, overDiceCoefficients, underDiceCoefficients } = require('../utils/constants')

class PlayService {
	constructor() { }

	playHiLow = async (info, user) => {
		const profile = await Profile.findOne({ where: { userId: user.id } })
		if (info.bet && profile.balance < info.bet) throw new Error('You don\'t have enough money, go to work, bro)')

		let games = JSON.parse(fs.readFileSync(require.resolve('../static/hilowActiveGames.json')))
		let activeGame = games.find(el => el.player === user.id)
		let status = ''

		if (info.bet && activeGame) {
			fs.writeFileSync(require.resolve('../static/hilowActiveGames.json'), JSON.stringify(games.filter(el => el.player !== user.id)))
			games = JSON.parse(fs.readFileSync(require.resolve('../static/hilowActiveGames.json')))
			activeGame = null
		}

		if (!activeGame) {
			activeGame = { player: user.id, bet: info.bet, coefficient: 1, card: info.card }
			games.push(activeGame)
			fs.writeFileSync(require.resolve('../static/hilowActiveGames.json'), JSON.stringify(games))
			status = `- ${info.bet}$`

			const newBalance = +((profile.balance - activeGame.bet).toFixed(2))
			await profile.update({ balance: newBalance })
			const token = generateToken(user.id, user.username, user.role, newBalance)

			const { hCoefficient, lCoefficient } = getCoefficients(getCardValue(activeGame.card))

			return { token, status: status, coefficients: { hCoefficient, lCoefficient } }
		} else if (info.mode) {
			// playing
			const token = generateToken(user.id, user.username, user.role, profile.balance)

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
					fs.writeFileSync(require.resolve('../static/hilowActiveGames.json'), JSON.stringify(games))
					return { token, coefficients: { hCoefficient, lCoefficient, tCoefficient: activeGame.coefficient }, card: newCard }
				} else {
					await History.create({ bet: `${activeGame.bet}$`, coefficient: `${activeGame.coefficient.toFixed(2)} x`, winnings: `- ${activeGame.bet}$`, userId: user.id, gameId: 1 })
					fs.writeFileSync(require.resolve('../static/hilowActiveGames.json'), JSON.stringify(games.filter(el => el.player !== user.id)))
					return { token, card: newCard }
				}
			} else if (info.mode === 'low') {
				if ((currentCardValue === 13 && newCardValue < currentCardValue) ||
					(currentCardValue !== 13 && newCardValue <= currentCardValue)) {
					activeGame.coefficient = activeGame.coefficient * getCoefficients(currentCardValue).lCoefficient
					activeGame.card = newCard
					fs.writeFileSync(require.resolve('../static/hilowActiveGames.json'), JSON.stringify(games))
					return { token, coefficients: { hCoefficient, lCoefficient, tCoefficient: activeGame.coefficient }, card: newCard }
				} else {
					await History.create({ bet: `${activeGame.bet}$`, coefficient: `${activeGame.coefficient.toFixed(2)} x`, winnings: `- ${activeGame.bet}$`, userId: user.id, gameId: 1 })
					fs.writeFileSync(require.resolve('../static/hilowActiveGames.json'), JSON.stringify(games.filter(el => el.player !== user.id)))
					return { token, card: newCard }
				}
			}
		} else {
			// cash out
			status = `+ ${(activeGame.bet * activeGame.coefficient - activeGame.bet).toFixed(2)}$`
			fs.writeFileSync(require.resolve('../static/hilowActiveGames.json'), JSON.stringify(games.filter(el => el.player !== user.id)))
			const newBalance = +((profile.balance + activeGame.bet * activeGame.coefficient).toFixed(2))
			const token = generateToken(user.id, user.username, user.role, newBalance)
			await History.create({ bet: `${activeGame.bet}$`, coefficient: `${activeGame.coefficient.toFixed(2)} x`, winnings: status, userId: user.id, gameId: 1 })
			await profile.update({ balance: newBalance, winnings_sum: +((profile.winnings_sum + newBalance - profile.balance - activeGame.bet).toFixed(2)) })
			await updateRank(profile)
			return { token, status }
		}
	}

	playDice = async (bet, currentDice, gameMode, user) => {
		const profile = await Profile.findOne({ where: { userId: user.id } })
		if (profile.balance < bet) throw new Error('You don\'t have enough money, go to work, bro)')

		let newDice = getRand(MIN_DICE, MAX_DICE), newBalance, coefficient, gameResult
		if (gameMode.toLowerCase() === 'over') {
			coefficient = overDiceCoefficients[currentDice - 2]
			if (newDice > currentDice) {
				gameResult = `+ ${(bet * coefficient - bet).toFixed(2)}$`
				newBalance = +((profile.balance - bet + bet * coefficient).toFixed(2))
			} else {
				gameResult = `- ${bet}$`
				newBalance = +((profile.balance - bet).toFixed(2))
			}
		} else if (gameMode.toLowerCase() === 'under') {
			coefficient = underDiceCoefficients[currentDice - 2]
			if (newDice < currentDice) {
				gameResult = `+ ${(bet * coefficient - bet).toFixed(2)}$`
				newBalance = +((profile.balance - bet + bet * coefficient).toFixed(2))
			} else {
				gameResult = `- ${bet}$`
				newBalance = +((profile.balance - bet).toFixed(2))
			}
		}

		await History.create({ bet: `${bet}$`, coefficient: `${coefficient} x`, winnings: gameResult, userId: user.id, gameId: 2 })
		if (newBalance > profile.balance)
			await profile.update({ balance: newBalance, winnings_sum: +((profile.winnings_sum + newBalance - profile.balance).toFixed(2)) })
		else
			await profile.update({ balance: newBalance })
		
		await updateRank(profile)
		const token = generateToken(user.id, user.username, user.role, newBalance)
		return { token, diceResult: newDice, gameResult: gameResult }
	}

	playMiner = async (info, user) => {
		const profile = await Profile.findOne({ where: { userId: user.id } })
		if (profile.balance < info.bet) throw new Error('You don\'t have enough money, go to work, bro)')

		let activeGames = JSON.parse(fs.readFileSync(require.resolve('../static/minerActiveGames.json')))
		let currentGame = activeGames.find(el => el.player === user.id)
		let newBalance = profile.balance
		let gameResult = null

		if (info.bet) {
			newBalance = +((profile.balance - info.bet).toFixed(2))
			await profile.update({ balance: newBalance })

			const bombsArray = getBombs(info.bombsCount)
			if (currentGame) {
				fs.writeFileSync(require.resolve('../static/minerActiveGames.json'), JSON.stringify(activeGames.filter(el => el.player !== user.id)))
				activeGames = JSON.parse(fs.readFileSync(require.resolve('../static/minerActiveGames.json')))
			}
			currentGame = { player: user.id, bet: info.bet, coefficient: 1, bombs: bombsArray, picked: [] }
			activeGames.push(currentGame)
			fs.writeFileSync(require.resolve('../static/minerActiveGames.json'), JSON.stringify(activeGames))

			let nextCoefficient = calculateCoefficient(25 - currentGame.bombs.length, 25)
			gameResult = {
				nextCoefficient: currentGame.coefficient * nextCoefficient
			}
		} else if (info.cellNumber) {
			if (currentGame.picked.includes(info.cellNumber)) throw new Error('You already picked that shit!')
			currentGame.picked.push(info.cellNumber)

			if (currentGame.bombs.includes(info.cellNumber)) {
				gameResult = {
					status: 'boom',
					bombs: currentGame.bombs,
					picked: currentGame.picked
				}
				await History.create({ bet: `${currentGame.bet}$`, coefficient: `${currentGame.coefficient.toFixed(2)} x`, winnings: `- ${currentGame.bet}$`, userId: user.id, gameId: 3 })
				fs.writeFileSync(require.resolve('../static/minerActiveGames.json'), JSON.stringify(activeGames.filter(el => el.player !== user.id)))
			} else {
				let coefficient = calculateCoefficient(26 - currentGame.picked.length - currentGame.bombs.length, 26 - currentGame.picked.length)
				currentGame.coefficient *= coefficient
				if (currentGame.bombs.length + currentGame.picked.length >= 25) {
					gameResult = {
						winnings: `+ ${(currentGame.bet * (currentGame.coefficient - 1)).toFixed(2)}$`,
						bombs: currentGame.bombs,
						picked: currentGame.picked
					}
					newBalance = +((profile.balance + currentGame.bet * currentGame.coefficient).toFixed(2))
					await profile.update({ balance: newBalance, winnings_sum: +((profile.winnings_sum + newBalance - profile.balance - currentGame.bet).toFixed(2)) })
					await updateRank(profile)
					await History.create({ bet: `${currentGame.bet}$`, coefficient: `${currentGame.coefficient.toFixed(2)} x`, winnings: gameResult.winnings, userId: user.id, gameId: 3 })
					fs.writeFileSync(require.resolve('../static/minerActiveGames.json'), JSON.stringify(activeGames.filter(el => el.player !== user.id)))
				} else {
					let nextCoefficient = calculateCoefficient(25 - currentGame.picked.length - currentGame.bombs.length, 25 - currentGame.picked.length)

					gameResult = {
						status: 'luck',
						currentCoefficient: currentGame.coefficient,
						nextCoefficient: currentGame.coefficient * nextCoefficient
					}
					fs.writeFileSync(require.resolve('../static/minerActiveGames.json'), JSON.stringify(activeGames))
				}
			}
		} else {
			// cash out
			gameResult = {
				winnings: `+ ${(currentGame.bet * (currentGame.coefficient - 1)).toFixed(2)}$`,
				bombs: currentGame.bombs,
				picked: currentGame.picked
			}
			newBalance = +((profile.balance + currentGame.bet * currentGame.coefficient).toFixed(2))
			await profile.update({ balance: newBalance, winnings_sum: +((profile.winnings_sum + newBalance - profile.balance - currentGame.bet).toFixed(2)) })
			await updateRank(profile)
			await History.create({ bet: `${currentGame.bet}$`, coefficient: `${currentGame.coefficient.toFixed(2)} x`, winnings: gameResult.winnings, userId: user.id, gameId: 3 })
			fs.writeFileSync(require.resolve('../static/minerActiveGames.json'), JSON.stringify(activeGames.filter(el => el.player !== user.id)))
		}

		const token = generateToken(user.id, user.username, user.role, newBalance)
		return { token, gameResult }
	}
}

module.exports = new PlayService()
