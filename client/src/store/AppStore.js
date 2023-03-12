import { makeAutoObservable } from 'mobx'

export default class AppStore {
	constructor() {
		this._sidebar = { hilow: false, dice: false, miner: false }
		this._betsHistory = []
		makeAutoObservable(this)
	}

	setSidebar(obj) {
		this._sidebar = obj
	}

	setHistory(arr) {
		this._betsHistory = arr
	}

	get sidebar() {
		return this._sidebar
	}

	get betsHistory() {
		return this._betsHistory
	}
}