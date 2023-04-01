const sequelize = require('../db')

const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	username: { type: DataTypes.STRING, unique: true },
	password: { type: DataTypes.STRING },
	role: { type: DataTypes.STRING, defaultValue: 'USER' },
})

const Profile = sequelize.define('user_profile', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	balance: { type: DataTypes.DOUBLE, defaultValue: 0 },
	winnings_sum: { type: DataTypes.DOUBLE, defaultValue: 0 },
}, { timestamps: false })

const Rank = sequelize.define('rank', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, unique: true, defaultValue: 'undefined rank' },
	value_to_achieve: { type: DataTypes.INTEGER },
}, { timestamps: false })

const History = sequelize.define('history', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	bet: { type: DataTypes.STRING, allowNull: false },
	coefficient: { type: DataTypes.STRING, allowNull: false },
	winnings: { type: DataTypes.STRING, allowNull: false },
})

const Game = sequelize.define('game', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, unique: true, defaultValue: 'undefined game' },
}, { timestamps: false })

const Review = sequelize.define('review', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	text: { type: DataTypes.STRING },
	rating: { type: DataTypes.INTEGER, defaultValue: 5 },
})

const Promocode = sequelize.define('promocode', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	code: { type: DataTypes.STRING, unique: true, allowNull: false },
	value: { type: DataTypes.DOUBLE, allowNull: false },
	count: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { timestamps: false })

User.hasOne(Profile)
Profile.belongsTo(User)

User.hasMany(History)
History.belongsTo(User)

Game.hasMany(History)
History.belongsTo(Game)

Rank.hasMany(Profile)
Profile.belongsTo(Rank)

User.hasMany(Review)
Review.belongsTo(User)

module.exports = {
	User, Profile, History, Game, Rank, Review, Promocode
}
