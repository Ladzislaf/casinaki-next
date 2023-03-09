import React from 'react'
import styles from './Sidebar.module.css'
import hiLowLogo from './img/hilo.svg'
import diceLogo from './img/dice.svg'
import minerLogo from './img/miner.svg'
import { NavLink } from 'react-router-dom'
import { DICE_ROUTE, HI_LOW_ROUTE, MINER_ROUTE } from '../../utils/constants'

const Sidebar = () => {
	return (
		<div className={styles.container}>
			<NavLink to={HI_LOW_ROUTE}>
				<img src={hiLowLogo} alt='hilo'/>
			</NavLink>
			<NavLink to={DICE_ROUTE}>
				<img src={diceLogo} alt='hilo'/>
			</NavLink>
			<NavLink to={MINER_ROUTE}>
				<img src={minerLogo} alt='hilo'/>
			</NavLink>
		</div>
	)
}

export default Sidebar