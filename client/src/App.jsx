import { observer } from 'mobx-react-lite'
import React, { useState, useEffect, useContext } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Context } from '.'
import AppRouter from './components/AppRouter'
import Loading from './components/Loading/Loading'
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
		return <Loading/>
	}

	return (
		<BrowserRouter>
			<div className='navbar'>
				<Navbar />
			</div>
			<div className='main-container'>
				<div className='sidebar'>
					<Sidebar />
				</div>
				<div className='content'>
					<AppRouter />
				</div>
			</div>
		</BrowserRouter>
	)
})

export default App
