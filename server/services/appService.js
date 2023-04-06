const { Rank, Promocode, Profile, ActivatedPromos } = require("../models/models")

class AppService {
	constructor() { }

	getRanks = async () => {
		return await Rank.findAll()
	}

	applyPromo = async (promocode, userId) => {
		const promo = await Promocode.findOne({ where: { code: promocode } })
		if (!promo) throw new Error(`Promocode ${promocode} not found`)
		if (promo.count <= 0) throw new Error(`Promocode ${promocode} is not available`)

		const profile = await Profile.findOne({ where: { userId } })
		const activePromo = ActivatedPromos.findOne({ where: { userProfileId: profile.id, promocodeId: promo.id } })
		if (activePromo) throw new Error(`You already activated promocode ${promocode}`)

		await promo.update({ count: promo.count - 1 })
		await profile.update({ balance: profile.balance + promo.value })
		await ActivatedPromos.create({ userProfileId: profile.id, promocodeId: promo.id })
		return { value: promo.value }
	}
}

module.exports = new AppService()
