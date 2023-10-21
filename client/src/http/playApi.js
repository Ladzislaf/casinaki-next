import { $authHost } from './index'
import jwt_decode from 'jwt-decode'

export const playDice = async (bet, currentDice, gameMode) => {
	const { data } = await $authHost.post('api/play/dice', { bet, currentDice, gameMode })
	localStorage.setItem('token', data.token)
	const { balance: newBalance } = jwt_decode(data.token)
	return { newBalance, diceResult: data.diceResult, gameResult: data.gameResult }
}

export const playHiLow = async (info) => {
	const { data } = await $authHost.post('api/play/hilow', { info })
	localStorage.setItem('token', data.token)
	const { balance: newBalance } = jwt_decode(data.token)
	return { newBalance, status: data.status, newCard: data.card, coefficients: data.coefficients }
}

export const playMiner = async (info) => {
	const { data } = await $authHost.post('api/play/miner', { info })
	localStorage.setItem('token', data.token)
	const { balance: newBalance } = jwt_decode(data.token)
	return { newBalance, gameResult: data.gameResult }
}

export const playBlackJack = async (parameters) => {
	const { data } = await $authHost.post('api/play/blackjack', { parameters })
	localStorage.setItem('token', data.token)
	const { balance: newBalance } = jwt_decode(data.token)
	return { newBalance, results: data.results }
}
