import React, { useContext, useEffect, useState } from 'react'
import Button from '../../components/ui/Button'
import styles from './Chat.module.css'
import { Context } from '../..'
import { socket } from '../../services/socket'
import { observer } from 'mobx-react-lite'
import Heading from '../../components/ui/Heading'
import InputArea from '../../components/ui/InputArea'

const Chat = observer(() => {
	const { user } = useContext(Context)
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState([])

	useEffect(() => {
		const onReceiveMessage = (username, message) => {
			setMessages((messages) => [...messages, { username, message }])
		}
		const onSync = (messages) => {
			setMessages(messages)
		}

		socket.on('receiveMessage', onReceiveMessage)
		socket.on('sync', onSync)
		socket.emit('sync')

		return () => {
			socket.off('connect', onReceiveMessage)
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
		<>
			<Heading>chat</Heading>
			
			<div className={styles.messagesList}>
				{messages.map((el, index) => {
					let isCurrentUser = el.username === user.user.username
					return (
						<div key={index} className={styles.messagesRow}>
							<span style={{ color: isCurrentUser && '#f87d09' }}>{el.username}</span>: {el.message}
						</div>
					)
				})}
			</div>

			{user.isAuth && (
				<>
					<InputArea placeholder='write a message' value={message} rows={4} onChange={(e) => setMessage(e.target.value)}/>
					<Button onClick={() => sendMessage()} width={'calc(100% - 0.4rem)'}>send</Button>
				</>
			)}
		</>
	)
})

export default Chat
