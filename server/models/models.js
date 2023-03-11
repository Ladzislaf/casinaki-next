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

User.hasOne(Profile)
Profile.belongsTo(User)

module.exports = {
	User, Profile
}
