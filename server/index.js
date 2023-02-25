const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')
const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use('/auth', authRouter)

const start = async () => {
	try {
		mongoose.set("strictQuery", false);
		await mongoose.connect('mongodb://localhost:27017/casinaki')
		app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
	} catch (e) {
		console.log(e)
	}
}

start()

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/api', (req, res) => res.json({info: 'hello from server !!!'}))