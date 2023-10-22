import { makeAutoObservable } from 'mobx'

export default class UserStore {
	constructor() {
		this._isAuth = false
		this._user = {}
		makeAutoObservable(this)
	}

	setIsAuth(bool) {
		this._isAuth = bool
	}

	setUser(user) {
		this._user = user
	}

	setUserBalance(balance) {
		this._user.balance = balance
	}

	get isAuth() {
		return this._isAuth
	}

	get user() {
		return this._user
	}

	get balance() {
		return +this._user.balance?.toFixed(2)
	}
}