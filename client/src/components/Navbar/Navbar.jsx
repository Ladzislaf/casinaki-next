import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'
import styles from './NavBar.module.css'
import { DEPOSIT_ROUTE, LOGIN_ROUTE, ADMIN_ROUTE, MAIN_ROUTE, PROFILE_ROUTE, RANKS_ROUTE, REGISTER_ROUTE, REVIEWS_ROUTE } from '../../utils/constants'
import logo from '../../assets/logo.png'

const Navbar = observer(() => {
	const { user } = useContext(Context)

	const logOut = () => {
		user.setUser({})
		user.setIsAuth(false)
		localStorage.removeItem('token')
	}

	return (
		<nav className={styles.nav}>
			<div>
				<NavLink className={styles.routes} to={MAIN_ROUTE}>
					<img className={styles.img} src={logo} alt='logo' />
				</NavLink>
			</div>
			<div className={styles.links_container}>
				{user.isAuth ?
					<>
						<div className={styles.info}>balance: {user.balance}$</div>
						<NavLink className={styles.routes} to={PROFILE_ROUTE}>{user.user.username}</NavLink>
						{user.user.role === 'ADMIN' && 
							<NavLink className={styles.routes} to={ADMIN_ROUTE}>admin_panel</NavLink>
						}
						<NavLink className={styles.routes} to={RANKS_ROUTE}>ranks</NavLink>
						<NavLink className={styles.routes} to={REVIEWS_ROUTE}>reviews</NavLink>
						<NavLink className={styles.routes} to={DEPOSIT_ROUTE}>deposit</NavLink>
						<NavLink className={styles.routes} to={MAIN_ROUTE} onClick={logOut}>logout</NavLink>
					</>
					:
					<>
						<NavLink className={styles.routes} to={RANKS_ROUTE}>ranks</NavLink>
						<NavLink className={styles.routes} to={REVIEWS_ROUTE}>reviews</NavLink>
						<NavLink className={styles.routes} to={LOGIN_ROUTE}>sign in</NavLink>
						<NavLink className={styles.routes} to={REGISTER_ROUTE} style={{ color: '#f87d09' }}>sign up</NavLink>
					</>
				}
			</div>
		</nav>
	)
})

export default Navbar
