import { makeAutoObservable } from 'mobx'

export default class PageStore {
	constructor() {
		this._sidebar = { hilow: false, dice: false, miner: false }
		makeAutoObservable(this)
	}

	setSidebar(obj) {
		this._sidebar = obj
	}

	get sidebar() {
		return this._sidebar
	}
}