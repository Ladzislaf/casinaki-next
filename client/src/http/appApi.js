import { $host } from './index'

export const getHistory = async () => {
	const { data } = await $host.get('api/history/get', {})
	return data.history
}

export const addHistory = async (bet, coefficient, winnings, userId, gameId) => {
	const { data } = await $host.post('api/history/add', { bet, coefficient, winnings, userId, gameId })
	return data
}