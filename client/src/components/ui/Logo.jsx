import React from 'react'

import styles from './ui.module.css'

const Logo = ({ scale, bordered, circled, ...props }) => {
	scale = scale || 1
	
	return (
		<img
			className={styles.logo}
			style={{
				width: (5 * scale).toFixed(2) + 'rem',
				border: bordered && (0.15 * scale).toFixed(2) + 'rem solid white',
				borderRadius: circled && '50%',
			}}
			{...props}
			alt=''
		/>
	)
}

export default Logo
