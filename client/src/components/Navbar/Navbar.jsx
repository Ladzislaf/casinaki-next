import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'
import styles from './NavBar.module.css'
import { DEPOSIT_ROUTE, HI_LOW_ROUTE, DICE_ROUTE, LOGIN_ROUTE, MAIN_ROUTE, REGISTER_ROUTE } from '../../utils/constants'

const Navbar = observer(() => {
	const { user } = useContext(Context)

	const logOut = () => {
		user.setUser({})
		user.setIsAuth(false)
	}

	return (
		<nav className={styles.nav}>
			<h2><NavLink to={MAIN_ROUTE}>CASINAKI</NavLink></h2>
			<div className={styles.links_container}>
				{user._isAuth ?
					<>
						<div className={styles.balance}>balance: {user._balance.toFixed(2)} fun</div>
						<NavLink className={styles.routes} to={HI_LOW_ROUTE}>hi-low</NavLink>
						<NavLink className={styles.routes} to={DICE_ROUTE}>dice</NavLink>
						<NavLink className={styles.routes} to={DEPOSIT_ROUTE}>deposit</NavLink>
						<NavLink className={styles.routes} to={LOGIN_ROUTE} onClick={() => logOut()}>logout</NavLink>
					</>
					:
					<>
						<NavLink className={styles.routes} to={LOGIN_ROUTE}>sign in</NavLink>
						<NavLink className={styles.routes} to={REGISTER_ROUTE} style={{ border: '1px solid white' }}>sign up</NavLink>
						<NavLink className={styles.routes} onClick={() => user.setIsAuth(true)}>demo sign in</NavLink>
					</>
				}
			</div>
		</nav>
	)
})

export default Navbar
