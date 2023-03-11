import { $authHost, $host } from './index'
import jwt_decode from 'jwt-decode'

export const registration = async (email, username, password) => {
	const { data } = await $host.post('api/user/registration', { email, username, password, role: 'USER' })
	localStorage.setItem('token', data.token)
	return jwt_decode(data.token)
}

export const login = async (email, password) => {
	const { data } = await $host.post('api/user/login', { email, password })
	localStorage.setItem('token', data.token)
	return jwt_decode(data.token)
}

export const check = async () => {
	const { data } = await $authHost.get('api/user/auth', {})
	localStorage.setItem('token', data.token)
	return jwt_decode(data.token)
}

export const updateBalance = async (balance) => {
	const { data } = await $authHost.post('api/user/set', { balance })
	localStorage.setItem('token', data.token)
	return jwt_decode(data.token)
}

