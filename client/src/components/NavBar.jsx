import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Context } from '..'
import styles from '../style/NavBar.module.css'
import { DEPOSIT_ROUTE, GAMES_ROUTE, LOGIN_ROUTE, MAIN_ROUTE, REGISTER_ROUTE } from '../utils/constants'

const NavBar = observer(() => {
	const { user } = useContext(Context)
	return (
		<nav className={styles.nav}>
			<h2><NavLink to={MAIN_ROUTE}>CASINAKI</NavLink></h2>
			<div className={styles.links_container}>
				{user._isAuth ?
					<>
						<NavLink className={styles.routes} to={GAMES_ROUTE}>games</NavLink>
						<NavLink className={styles.routes} to={DEPOSIT_ROUTE}>deposit</NavLink>
					</>
					:
					<>
						<NavLink className={styles.routes} to={LOGIN_ROUTE} onClick={() => user.setIsAuth(true)}>login</NavLink>
						<NavLink className={styles.routes} to={REGISTER_ROUTE}>register</NavLink>
					</>
				}
			</div>
		</nav>
	)
})

export default NavBar
