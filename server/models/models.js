const sequelize = require('../db')

const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	email: { type: DataTypes.STRING, unique: true },
	username: { type: DataTypes.STRING },
	password: { type: DataTypes.STRING },
	role: { type: DataTypes.STRING, defaultValue: 'USER' }
})

const Profile = sequelize.define('user_profile', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	balance: { type: DataTypes.DOUBLE, defaultValue: 0 },
	image: { type: DataTypes.STRING, defaultValue: 'img.png' },
})

const History = sequelize.define('history', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	bet: { type: DataTypes.STRING, allowNull: false },
	coefficient: { type: DataTypes.STRING, allowNull: false },
	winnings: { type: DataTypes.STRING, allowNull: false }
})

const Game = sequelize.define('games', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, unique: true, defaultValue: 'undefined game' }
})

User.hasOne(Profile)
Profile.belongsTo(User)

User.hasMany(History)
History.belongsTo(User)

Game.hasMany(History)
History.belongsTo(Game)

module.exports = {
	User, Profile, History, Game
}
