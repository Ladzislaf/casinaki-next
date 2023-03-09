import React, { useContext } from 'react'
import styles from './Sidebar.module.css'
import hiLowLogo from './img/hilo.svg'
import diceLogo from './img/dice.svg'
import minerLogo from './img/miner.svg'
import { NavLink } from 'react-router-dom'
import { DICE_ROUTE, HI_LOW_ROUTE, MINER_ROUTE } from '../../utils/constants'
import { Context } from '../..'
import { observer } from 'mobx-react-lite'

const Sidebar = observer(() => {
	const { page } = useContext(Context)

	const clickHandler = (element) => {
		switch (element) {
			case 'hilo': page.setSidebar({ hilow: true, dice: false, miner: false })
				break
			case 'dice': page.setSidebar({ hilow: false, dice: true, miner: false })
				break
			case 'miner': page.setSidebar({ hilow: false, dice: false, miner: true })
				break
			default:
		}
	}

	return (
		<div className={styles.container}>
			<NavLink to={HI_LOW_ROUTE} onClick={() => clickHandler('hilo')} className={page._sidebar.hilow && styles.clicked}>
				<img src={hiLowLogo} alt='hilo' />
			</NavLink>
			<NavLink to={DICE_ROUTE} onClick={() => clickHandler('dice')} className={page._sidebar.dice && styles.clicked}>
				<img src={diceLogo} alt='dice' />
			</NavLink>
			<NavLink to={MINER_ROUTE} onClick={() => clickHandler('miner')} className={page._sidebar.miner && styles.clicked}>
				<img src={minerLogo} alt='miner' />
			</NavLink>
		</div>
	)
})

export default Sidebar