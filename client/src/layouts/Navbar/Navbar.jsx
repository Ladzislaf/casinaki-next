import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'
import { DEPOSIT_ROUTE, LOGIN_ROUTE, ADMIN_ROUTE, MAIN_ROUTE, PROFILE_ROUTE, RANKS_ROUTE, REGISTER_ROUTE, REVIEWS_ROUTE } from '../../utils/constants'
import logo from '../../assets/images/logo.png'
import Logo from '../../components/ui/Logo'
import Linker from '../../components/ui/Linker'

const Navbar = observer(() => {
	const { user } = useContext(Context)

	const logOut = () => {
		user.setUser({})
		user.setIsAuth(false)
		localStorage.removeItem('token')
	}

	return (
		<>
			<Linker to={MAIN_ROUTE}>
				<Logo src={logo} scale={1.2}/>
			</Linker>
			
			{user.isAuth ?
				<div>
					{user.user.role === 'ADMIN' && <Linker to={ADMIN_ROUTE}>admin_panel</Linker>}
					<Linker to={RANKS_ROUTE}>ranks</Linker>
					<Linker to={REVIEWS_ROUTE}>reviews</Linker>
					<Linker to={DEPOSIT_ROUTE}>deposit</Linker>
					<div>
						<Linker to={PROFILE_ROUTE}>{user.user.username}</Linker>
						<div style={{ color: '#f87d09' }}> {user.balance}$</div>
					</div>
					<Linker to={MAIN_ROUTE} onClick={() => logOut()} color={'#f87d09'}>logout</Linker>
				</div>
				:
				<div>
					<Linker to={RANKS_ROUTE}>ranks</Linker>
					<Linker to={REVIEWS_ROUTE}>reviews</Linker>
					<Linker to={LOGIN_ROUTE}>sign in</Linker>
					<Linker to={REGISTER_ROUTE} color={'#f87d09'}>sign up</Linker>
				</div>
			}			
		</>
	)
})

export default Navbar
