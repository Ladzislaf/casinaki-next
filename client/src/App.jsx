import { observer } from 'mobx-react-lite'
import React, { useState, useEffect, useContext } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Context } from '.'
import AppRouter from './components/AppRouter'
import NavBar from './components/NavBar'
import { check } from './http/userAPI'

const App = observer(() => {
	const { user } = useContext(Context)
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		check()
			.then(data => {
				user.setUser(data)
				user.setIsAuth(true)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [user])

	if (loading) {
		return <div>loading...</div>
	}

	return (
		<BrowserRouter>
			<NavBar />
			<AppRouter />
		</BrowserRouter>
	)
})

export default App
