import { makeAutoObservable } from 'mobx'

export default class UserStore {
	constructor() {
		this._isAuth = false
		this._user = { balance: 2 }
		makeAutoObservable(this)
	}

	setIsAuth(bool) {
		this._isAuth = bool
	}

	setUser(user) {
		this._user = user
	}

	setBalance(balance) {
		this._user.balance = balance
	}

	get isAuth() {
		return this._isAuth
	}

	get user() {
		return this._user
	}
}