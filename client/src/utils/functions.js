export const getRand = (min, max) => {
	return (Math.floor(Math.random() * (max - min + 1)) + min)
}

export const getCardsDeck = () => {
	const suits = ['♠', '♥', '♦', '♣']
	const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
	const cards = []

	for (let i = 0; i < cardValues.length; i++) {
		for (let j = 0; j < suits.length; j++) {
			const key = cardValues[i] + suits[j]
			if (suits[j] === '♥' || suits[j] === '♦')
				cards.push({ key: key, value: i + 1, color: 'red' })
			else
				cards.push({ key: key, value: i + 1, color: 'black' })
		}
	}

	return cards
}
