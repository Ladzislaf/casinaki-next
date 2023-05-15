import { $authHost, $host } from './index'
import jwt_decode from 'jwt-decode'

export const registration = async (username, password) => {
	const { data } = await $host.post('api/user/registration', { username, password })
	localStorage.setItem('token', data.token)
	return jwt_decode(data.token)
}

export const login = async (username, password) => {
	const { data } = await $host.post('api/user/login', { username, password })
	localStorage.setItem('token', data.token)
	return jwt_decode(data.token)
}

export const check = async () => {
	const { data } = await $authHost.get('api/user/auth', {})
	localStorage.setItem('token', data.token)
	return jwt_decode(data.token)
}

export const changeUsername = async (newUsername) => {
	const { data } = await $authHost.post('api/user/change', { newUsername })
	localStorage.setItem('token', data.token)
	return jwt_decode(data.token)
}

export const getUsersList = async () => {
	const { data } = await $authHost.get('api/user/all', {})
	return data.usersList
}

export const blockUser = async (userId) => {
	const { data } = await $authHost.post('api/user/block', { userId })
	return data.info
}

export const getBonus = async () => {
	const { data } = await $authHost.get('api/user/bonus', {})
	return data.info
}
