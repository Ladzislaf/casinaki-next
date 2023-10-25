import React from 'react'
import { BLACKJACK_ROUTE, DICE_ROUTE, HI_LOW_ROUTE, MINER_ROUTE } from '../../utils/constants'

import hiLowLogo from '../../assets/images/sidebar_icons/hilo.svg'
import diceLogo from '../../assets/images/sidebar_icons/dice.svg'
import minerLogo from '../../assets/images/sidebar_icons/bomb.svg'
import blackjackLogo from '../../assets/images/sidebar_icons/blackjack.svg'
import Linker from '../../components/ui/Linker'
import Logo from '../../components/ui/Logo'

const Sidebar = () => {
	return (
		<>
			<Linker to={HI_LOW_ROUTE}>
				<Logo src={hiLowLogo} scale={0.5}/>
			</Linker>
			<Linker to={DICE_ROUTE}>
				<Logo src={diceLogo} scale={0.5}/>
			</Linker>
			<Linker to={MINER_ROUTE}>
				<Logo src={minerLogo} scale={0.5}/>
			</Linker>
			<Linker to={BLACKJACK_ROUTE}>
				<Logo src={blackjackLogo} scale={0.5}/>
			</Linker>
		</>
	)
}

export default Sidebar