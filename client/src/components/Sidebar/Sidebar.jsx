import React from 'react'
import styles from './Sidebar.module.css'
import { NavLink } from 'react-router-dom'
import { DICE_ROUTE, HI_LOW_ROUTE, MINER_ROUTE } from '../../utils/constants'

import hiLowLogo from '../../assets/sidebar_icons/hilo.svg'
import diceLogo from '../../assets/sidebar_icons/dice.svg'
import minerLogo from '../../assets/sidebar_icons/miner.svg'

const Sidebar = () => {
	return (
		<div className={styles.container}>
			<NavLink to={HI_LOW_ROUTE}>
				<div>
					<img src={hiLowLogo} alt='hilo' />
				</div>
			</NavLink>
			<NavLink to={DICE_ROUTE}>
				<div>
					<img src={diceLogo} alt='dice' />
				</div>
			</NavLink>
			<NavLink to={MINER_ROUTE}>
				<div>
					<img src={minerLogo} alt='miner' />
				</div>
			</NavLink>
		</div>
	)
}

export default Sidebar