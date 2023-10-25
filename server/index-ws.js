require('dotenv').config()
const { Server } = require('socket.io')

const io = new Server(process.env.WS_PORT || 5001, {
	cors: {
		origin: [process.env.CLIENT_URL, process.env.LOCAL_CLIENT_URL],
	},
})

let messages = []

io.on('connection', (socket) => {
	console.log('user connected:', socket.id)
	
	socket.on('sync', () => {
		socket.emit('sync', messages)
	})

	socket.on('sendMessage', (info) => {
		console.log(info)
		socket.broadcast.emit('receiveMessage', info.username, info.message)
		messages.push(info)
		if (messages.length >= 31) {
			messages.shift()
		}
	})
})

console.log(process.env.WS_PORT)
console.log(process.env.LOCAL_CLIENT_URL || process.env.CLIENT_URL)
