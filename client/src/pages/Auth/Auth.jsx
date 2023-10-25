import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Context } from '../..'
import { login, registration } from '../../services/http/userAPI'
import { LOGIN_ROUTE, MAIN_ROUTE, REGISTER_ROUTE } from '../../utils/constants'
import Input from '../../components/ui/Input'
import Heading from '../../components/ui/Heading'
import Button from '../../components/ui/Button'
import Linker from '../../components/ui/Linker'

const Auth = observer(() => {
	const { user } = useContext(Context)
	const location = useLocation()
	const navigate = useNavigate()
	const isLogin = location.pathname === LOGIN_ROUTE
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [passwordConfirm, setPasswordConfirm] = useState('')

	const submitHandler = async e => {
		e.preventDefault()
		try {
			let data
			if (isLogin) {
				data = await login(username, password)
			} else {
				if (!validateInputs()) return
				data = await registration(username, password)
			}
			user.setUser(data)
			user.setIsAuth(true)
			navigate(MAIN_ROUTE)
		} catch (e) {
			alert(e.response.data.message)
		}
	}

	const validateInputs = () => {
		if (username.length < 5 || username.length > 20) {
			alert('Username length must be from 5 to 20')
			return false
		}
		if (password.length < 8) {
			alert('Password must be 8 or more characters')
			return false
		}
		if (password !== passwordConfirm) {
			alert('Passwords dont match')
			return false
		}
		return true
	}

	return (
		<>
			<form>
				{isLogin ? <Heading>authorization</Heading> : <Heading>registration</Heading>}
				<Input
					size={30}
					maxLength={29}
					placeholder='username'
					value={username}
					onChange={e => setUsername(e.target.value)}
					required
				/>
				<Input
					size={30}
					maxLength={29}
					type='password'
					placeholder='password'
					value={password}
					onChange={e => setPassword(e.target.value)}
					required
				/>
				{isLogin ? (
					<>
						<Button onClick={e => submitHandler(e)}>login</Button>
						<div>Don't have an account? <Linker to={REGISTER_ROUTE}>register</Linker></div>
					</>
				) : (
					<>
						<Input
							size={30}
							maxLength={29}
							type='password'
							placeholder='confirm'
							value={passwordConfirm}
							onChange={e => setPasswordConfirm(e.target.value)}
							required
						/>
						<Button onClick={e => submitHandler(e)}>register</Button>
						<div>Have an account? <Linker to={LOGIN_ROUTE}>login</Linker></div>
					</>
				)}
			</form>
		</>
	)
})

export default Auth
