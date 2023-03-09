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
	}

	const clearSidebar = () => {
		page.setSidebar({ hilow: false, dice: false, miner: false })
	}

	return (
		<nav className={styles.nav}>
			<div>
				<NavLink to={MAIN_ROUTE} onClick={clearSidebar} >
					<img className={styles.img} src={logo} alt='logo'/>
				</NavLink>
			</div>
			<div className={styles.links_container}>
				{user._isAuth ?
					<>
						<div className={styles.balance}>balance: {user._balance.toFixed(2)} fun</div>
						<NavLink className={styles.routes} to={DEPOSIT_ROUTE} onClick={clearSidebar}>deposit</NavLink>
						<NavLink className={styles.routes} to={LOGIN_ROUTE} onClick={() => logOut()}>logout</NavLink>
					</>
					:
					<>
						<NavLink className={styles.routes} to={LOGIN_ROUTE} onClick={clearSidebar}>sign in</NavLink>
						<NavLink className={styles.routes} to={REGISTER_ROUTE} style={{ border: '1px solid white' }} onClick={clearSidebar}>sign up</NavLink>
						<NavLink className={styles.routes} onClick={() => { user.setIsAuth(true); clearSidebar() }}>demo sign in</NavLink>
					</>
				}
			</div>
		</nav>
	)
})

export default Navbar
