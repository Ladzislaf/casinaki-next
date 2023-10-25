import React from 'react'
import logo from '../../assets/images/logo.png'
import BetHistory from './BetHistory'
import Logo from '../../components/ui/Logo'

const Main = () => {
	return (
		<>
			<Logo src={logo} scale={3} />
			<BetHistory />
		</>
	)
}

export default Main