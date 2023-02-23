import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Context } from '..'
import styles from '../style/NavBar.module.css'
import { DEPOSIT_ROUTE, GAMES_ROUTE, LOGIN_ROUTE, MAIN_ROUTE, REGISTER_ROUTE } from '../utils/constants'

const NavBar = observer(() => {
	const { user } = useContext(Context)
	return (
		<nav>
			<h2><NavLink to={MAIN_ROUTE}>CASINAKI</NavLink></h2>
			{user._isAuth ?
				<ul>
					<li><NavLink className={styles.routes} to={GAMES_ROUTE}>games</NavLink></li>
					<li><NavLink className={styles.routes} to={DEPOSIT_ROUTE}>deposit</NavLink></li>
				</ul>
				:
				<ul>
					<li><NavLink className={styles.routes} to={LOGIN_ROUTE} onClick={() => user.setIsAuth(true)}>login</NavLink></li>
					<li><NavLink className={styles.routes} to={REGISTER_ROUTE}>register</NavLink></li>
				</ul>
			}
		</nav>
	)
})

export default NavBar
