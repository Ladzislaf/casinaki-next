export const getRand = (min, max) => {
	return (Math.floor(Math.random() * (max - min + 1)) + min)
}

export const getCardsDeck = (game = 'default') => {
	const suits = ['♠', '♥', '♦', '♣']
	const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
	const values = {
		'default': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
		'blackjack': [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11],
	}
	const cards = []

	for (let i = 0; i < ranks.length; i++) {
		for (let suit of suits) {
			cards.push({ 'index': ranks[i] + suit, 'value': values[game][i] })
		}
	}
	cards.push({ 'index': 'joker', 'value': 0 })

	return cards
}
