require('dotenv').config()
const { Server } = require('socket.io')

const io = new Server(process.env.WS_PORT || 5001, {
	cors: {
		origin: [process.env.CLIENT_URL, process.env.LOCAL_CLIENT_URL],
	},
})

let messages = []

io.on('connection', (socket) => {
	console.log(socket.id)
	
	socket.on('sync', () => {
		socket.emit('sync', messages)
	})

	socket.on('sendMessage', (info) => {
		console.log(info)
		socket.broadcast.emit('recieveMessage', info.username, info.message)
		messages.unshift(info)
		if (messages.length >= 11) {
			messages.pop()
		}
	})
})

console.log(process.env.WS_PORT)
console.log(process.env.LOCAL_CLIENT_URL || process.env.CLIENT_URL)
