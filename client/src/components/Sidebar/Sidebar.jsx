import React, { useContext } from 'react'
import styles from './Sidebar.module.css'
import hiLowLogo from './img/hilo.svg'
import diceLogo from './img/dice.svg'
import minerLogo from './img/miner.png'
import { NavLink } from 'react-router-dom'
import { DICE_ROUTE, HI_LOW_ROUTE, MINER_ROUTE } from '../../utils/constants'
import { Context } from '../..'
import { observer } from 'mobx-react-lite'

const Sidebar = observer(() => {
	const { app } = useContext(Context)

	const clickHandler = (element) => {
		switch (element) {
			case 'hilo': app.setSidebar({ hilow: true, dice: false, miner: false })
				break
			case 'dice': app.setSidebar({ hilow: false, dice: true, miner: false })
				break
			case 'miner': app.setSidebar({ hilow: false, dice: false, miner: true })
				break
			default:
		}
	}

	return (
		<div className={styles.container}>
			<NavLink to={HI_LOW_ROUTE} onClick={() => clickHandler('hilo')} className={app._sidebar.hilow && styles.clicked}>
				<div>
					<img src={hiLowLogo} alt='hilo' />
				</div>
			</NavLink>
			<NavLink to={DICE_ROUTE} onClick={() => clickHandler('dice')} className={app._sidebar.dice && styles.clicked}>
				<div>
					<img src={diceLogo} alt='dice' />
				</div>
			</NavLink>
			<NavLink to={MINER_ROUTE} onClick={() => clickHandler('miner')} className={app._sidebar.miner && styles.clicked}>
				<div>
					<img src={minerLogo} alt='miner' />
				</div>
			</NavLink>
		</div>
	)
})

export default Sidebar