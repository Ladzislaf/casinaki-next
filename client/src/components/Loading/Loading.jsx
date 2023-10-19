import React from 'react'
import styles from './Loading.module.css'

const Loading = () => {
	return (
		<div className={styles.box}>
			<div className={styles.coin}>loading</div>
			<div>the site uses free server, so the loading may take about a minute...</div>
		</div>
	)
}

export default Loading