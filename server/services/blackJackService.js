const { Profile } = require("../models/models")
const { MIN_CARD, MAX_CARD } = require("../utils/constants")
const { getRand, generateToken, getBlackJackCardValue } = require("../utils/functions")

class BlackJackService {
    constructor() {
        this.activeGames = []
    }

    async startGame(parameters, user) {
        const profile = await Profile.findOne({ where: { userId: user.id } })
		if (parameters.bet && profile.balance < parameters.bet) throw new Error('You don\'t have enough money, go to work, bro)')
        let newBalance = profile.balance
        let results = {}

        let currentGame = this.activeGames.filter( game => game.player === user.id )[0]
        if (parameters.bet && currentGame) { currentGame = undefined }
        if (currentGame) {
            if (parameters.another) {
                currentGame.playerCards.push(this.generateCard([...currentGame.playerCards, ...currentGame.dealerCards]))
                if(this.getCardsSum(currentGame.playerCards) > 21) {
                    results.gameOver = true
                    this.activeGames = this.activeGames.filter( game => game.player !== user.id )
                }
                results.playerCards = currentGame.playerCards
            } else {
                // enough - dealaer take cards
                while (this.getCardsSum(currentGame.dealerCards) < 17) {
                    currentGame.dealerCards.push(this.generateCard([...currentGame.playerCards, ...currentGame.dealerCards]))
                }
                let dealerResultSum = this.getCardsSum(currentGame.dealerCards)
                let playerResultSum = this.getCardsSum(currentGame.playerCards)
                if (dealerResultSum === playerResultSum) {
                    results.draw = true
                    newBalance = +((profile.balance + currentGame.bet).toFixed(2))
                    await profile.update({ balance: newBalance })
                } else if (dealerResultSum < 22 && dealerResultSum > playerResultSum) {
                    results.gameOver = true
                } else {
                    newBalance = +((profile.balance + currentGame.bet * 2).toFixed(2))
                    await profile.update({ balance: newBalance })
                }
                results.dealerCards = currentGame.dealerCards
                this.activeGames = this.activeGames.filter( game => game.player !== user.id )
            }
        } else {
            let generatedCards = this.generateUniqueCards(4)
            let dealerCardsGenerated = [generatedCards[0], generatedCards[1]]
            let playerCardsGenerated = [generatedCards[2], generatedCards[3]]
            this.activeGames.push({ 
                'player': user.id, 
                'bet': parameters.bet, 
                'dealerCards': dealerCardsGenerated, 
                'playerCards': playerCardsGenerated 
            })
            newBalance = +((profile.balance - parameters.bet).toFixed(2))
            await profile.update({ balance: newBalance })
            results.dealerCards = [dealerCardsGenerated[0]]
            results.playerCards = playerCardsGenerated
        }
        
        const token = generateToken(user.id, user.username, user.role, newBalance)
        return { token, results }
    }

    // generating unique cards process might be simplier
    generateCard(openedCards) {
        let newCard = getRand(MIN_CARD, MAX_CARD)
        while (openedCards.includes(newCard)) {
            newCard = getRand(MIN_CARD, MAX_CARD)
        }
        return newCard
    }

    generateUniqueCards(countOfCards) {
        let generatedCards = []
        for (let i = 0; i < countOfCards; i++) {
            generatedCards.push(this.generateCard(generatedCards))
        }
        return generatedCards
    }

    getCardsSum(cardsArray) {
        let sum = 0
        let counterOfA = 0
        for (let card of cardsArray) {
            let value = getBlackJackCardValue(card)
            if (value === 11) { counterOfA++ } 
            sum += value
        }
        while (counterOfA && sum > 21) {
            sum -= 10
            counterOfA--
        }
        return sum
    }
}

module.exports = new BlackJackService()
