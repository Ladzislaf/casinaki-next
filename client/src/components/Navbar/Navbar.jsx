import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'
import styles from './NavBar.module.css'
import { DEPOSIT_ROUTE, LOGIN_ROUTE, MAIN_ROUTE, REGISTER_ROUTE } from '../../utils/constants'
import logo from '../../static/logo.png'

const Navbar = observer(() => {
	const { user, page } = useContext(Context)

	const logOut = () => {
		user.setUser({})
		user.setIsAuth(false)
		clearSidebar()
		localStorage.removeItem('token')
	}

	const clearSidebar = () => {
		page.setSidebar({ hilow: false, dice: false, miner: false })
	}

	return (
		<nav className={styles.nav}>
			<div>
				<NavLink to={MAIN_ROUTE} onClick={clearSidebar} >
					<img className={styles.img} src={logo} alt='logo' />
				</NavLink>
			</div>
			<div className={styles.links_container}>
				{user._isAuth ?
					<>
						<div className={styles.info}>user: {user._user.username}</div>
						<div className={styles.info}>balance: {user._user.balance.toFixed(2)}$</div>
						{user._user.role === 'ADMIN' && 
							<NavLink className={styles.routes} to={MAIN_ROUTE} onClick={clearSidebar}>admin_panel</NavLink>
						}
						<NavLink className={styles.routes} to={DEPOSIT_ROUTE} onClick={clearSidebar}>deposit</NavLink>
						<NavLink className={styles.routes} to={MAIN_ROUTE} onClick={logOut}>logout</NavLink>
					</>
					:
					<>
						<NavLink className={styles.routes} to={LOGIN_ROUTE} onClick={clearSidebar}>sign in</NavLink>
						<NavLink className={styles.routes} to={REGISTER_ROUTE} style={{ border: '1px solid white' }} onClick={clearSidebar}>sign up</NavLink>
					</>
				}
			</div>
		</nav>
	)
})

export default Navbar
