import { $host } from './index'

export const getHistory = async () => {
	const { data } = await $host.get('api/history/get', {})
	return data.history
}
