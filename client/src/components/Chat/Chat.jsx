import React, { useContext, useEffect, useState } from 'react'
import Button from '../Button/Button'
import styles from './Chat.module.css'
import { Context } from '../..'
import { socket } from '../../socket'
import { observer } from 'mobx-react-lite'

const Chat = observer(() => {
	const { user } = useContext(Context)
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState([])

	useEffect(() => {
		const onRecieveMessage = (username, message) => {
			setMessages((messages) => [...messages, { username, message }])
		}
		const onSync = (messages) => {
			setMessages(messages)
		}

		socket.on('recieveMessage', onRecieveMessage)
		socket.on('sync', onSync)
		socket.emit('sync')

		return () => {
			socket.off('connect', onRecieveMessage)
			socket.off('sync', onSync)
		}
	}, [])

	const sendMessage = () => {
		if (message.trim().length !== 0) {
			socket.emit('sendMessage', { username: user.user.username, message: message.trim() })
			setMessage('')
			setMessages([...messages, { username: user.user.username, message: message.trim() }])
		}
	}

	return (
		<div className={styles.container}>
			<h2>chat</h2>
			<div className={styles.messagesArea}>
				{messages.map((el, index) => {
					if (el.username === user.user.username) {
						return (
							<div key={index}>
								<span style={{ color: 'orange' }}>{el.username}</span>: {el.message}
							</div>
						)
					} else {
						return (
							<div key={index}>
								{el.username}: {el.message}
							</div>
						)
					}
				})}
			</div>
			{user.isAuth && (
				<div className={styles.inputArea}>
					<textarea placeholder="write a message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
					<Button onClick={() => sendMessage()}>send</Button>
				</div>
			)}
		</div>
	)
})

export default Chat
