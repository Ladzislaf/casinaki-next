import React from 'react'
import styles from './Main.module.css'
import logo from '../../static/logo.png'
import BetHistory from '../../components/BetHistory/BetHistory'

const Main = () => {
	return (
		<div className={styles.container}>
			<img src={logo} className={styles.img} alt='logo' />
			<BetHistory />
		</div>
	)
}

export default Main