import { $host, $authHost } from './index'

export const getHistory = async () => {
	const { data } = await $host.get('api/history/get', {})
	return data.history
}

export const fetchRanks = async () => {
	const { data } = await $host.get('api/ranks', {})
	return data.ranks
}

export const applyPromo = async ({ promo }) => {
	const { data } = await $authHost.post('api/promo', { promocode: promo })
	return data.result
}

export const getReviews = async () => {
	const { data } = await $host.get('api/review/get', {})
	return data.allReviews
}

export const writeReview = async ({ review }) => {
	const { data } = await $authHost.post('api/review/write', { review: review })
	return data.allReviews
}

export const deleteReview = async () => {
	const { data } = await $authHost.post('api/review/delete', { })
	return data.allReviews
}