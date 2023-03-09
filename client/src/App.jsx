import { observer } from 'mobx-react-lite'
import React, { useState, useEffect, useContext } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Context } from '.'
import AppRouter from './components/AppRouter'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
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
			<Navbar />
			<div className='main-container'>
				<Sidebar />
				<div className='content'>
					<AppRouter />
				</div>
			</div>
		</BrowserRouter>
	)
})

export default App
