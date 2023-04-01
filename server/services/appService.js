const { Rank, Promocode, Profile } = require("../models/models")

class AppService {
	constructor() { }

	getRanks = async () => {
		return await Rank.findAll()
	}

	applyPromo = async (promocode, userId) => {
		const row = await Promocode.findOne({ where: { code: promocode } })
		if (!row) throw new Error(`Promocode ${promocode} not found`)
		if (row.count <= 0) throw new Error(`Promocode ${promocode} is not available`)
		await row.update({ count: row.count - 1 })
		const profile = await Profile.findOne({ where: { userId } })
		await profile.update({ balance: profile.balance + row.value })
		return { value: row.value }
	}
}

module.exports = new AppService()
