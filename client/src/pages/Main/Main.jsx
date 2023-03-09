import React from 'react'

import styles from './Main.module.css'
import logo from '../../static/logo.png'

const Main = () => {
	return (
		<div className={styles.container}>
			<img src={logo} className={styles.img} alt='logo' />
			<div>
				<h3>bets history: soon...</h3>
			</div>
		</div>
	)
}

export default Main