const express = require('express')
const app = express()
const PORT = 3001

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/api', (req, res) => res.json({info: 'hello from server !!!'}))