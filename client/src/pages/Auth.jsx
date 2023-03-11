import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Context } from '..'
import { login, registration } from '../http/userAPI'
import styles from '../style/Auth.module.css'
import { LOGIN_ROUTE, MAIN_ROUTE, REGISTER_ROUTE } from '../utils/constants'

const Auth = observer(() => {
	const { user } = useContext(Context)
	const location = useLocation()
	const navigate = useNavigate()
	const isLogin = location.pathname === LOGIN_ROUTE
	const [email, setEmail] = useState('')
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const submitHandler = async (e) => {
		e.preventDefault()
		try {
			let data
			if (isLogin) {
				data = await login(email, password)
			} else {
				data = await registration(email, username, password)
			}
			user.setUser(data)
			user.setIsAuth(true)
			navigate(MAIN_ROUTE)
		} catch (e) {
			alert(e.response.data.message)
		}
	}

	return (
		<div className={styles.container} style={{ height: window.innerHeight - 54 }}>
			{isLogin ? <h2>authorization</h2> : <h2>registration</h2>}
			<form>
				<input type='email' placeholder='Input email' value={email} onChange={e => setEmail(e.target.value)} required />
				{isLogin ?
					<>
						<input type='password' placeholder='Input password' value={password} onChange={e => setPassword(e.target.value)} required />
						<button onClick={e => submitHandler(e)}>login</button>
						<div style={{ textAlign: 'center' }}>
							Don't have an account? <NavLink to={REGISTER_ROUTE}>register</NavLink>
						</div>
					</>
					:
					<>
						<input type='text' placeholder='Input username' value={username} onChange={e => setUsername(e.target.value)} required />
						<input type='password' placeholder='Input password' value={password} onChange={e => setPassword(e.target.value)} required />
						<input type='password' placeholder='Confirm password' required />
						<button onClick={e => submitHandler(e)}>register</button>
						<div style={{ textAlign: 'center' }}>
							Have an account? <NavLink to={LOGIN_ROUTE}>login</NavLink>
						</div>
					</>
				}
			</form>
		</div>
	)
})

export default Auth