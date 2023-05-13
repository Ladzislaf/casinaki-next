require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require('./middlewares/ErrorHandlingMiddleware')

const PORT = process.env.PORT || 5000
const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)
app.use(errorHandler)

const start = async () => {
	try {
		await sequelize.authenticate()
		await sequelize.sync()
		app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
	} catch (e) {
		console.log(e)
	}
}

start()

app.get('/', (req, res) => res.send('Hello World!'))
