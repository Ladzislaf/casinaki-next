import { makeAutoObservable } from 'mobx'

export default class AppStore {
	constructor() {
		this._betsHistory = []
		this._ranks = []
		makeAutoObservable(this)
	}

	setHistory(arr) {
		this._betsHistory = arr
	}

	setRanks(arr) {
		this._ranks = arr
	}

	get betsHistory() {
		return this._betsHistory
	}

	get ranks() {
		return this._ranks
	}
}