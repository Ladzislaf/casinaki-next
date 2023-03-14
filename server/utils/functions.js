const jwt = require('jsonwebtoken')

const generateToken = (id, email, username, role, balance) => {
	return jwt.sign(
		{ id, email, username, role, balance },
		process.env.SECRET_KEY,
		{ expiresIn: '24h' }
	)
}

const getRand = (min, max) => {
	return (Math.floor(Math.random() * (max - min + 1)) + min)
}

const getCardValue = (card) => {
	return Math.floor(card / 4) + 1
}

const getCoefficients = (cardValue) => {
	let higherCoefficient, lowerCoefficient
	if (cardValue === 13) {
		higherCoefficient = 12.61
		lowerCoefficient = 1.05
	} else if (cardValue === 1) {
		higherCoefficient = 1.05
		lowerCoefficient = 12.61
	} else {
		higherCoefficient = 0.97 / ((14 - cardValue) / 13)
		lowerCoefficient = 0.97 / (cardValue / 13)
	}

	return({ hCoefficient: higherCoefficient, lCoefficient: lowerCoefficient })
}

module.exports = { generateToken, getRand, getCardValue, getCoefficients }