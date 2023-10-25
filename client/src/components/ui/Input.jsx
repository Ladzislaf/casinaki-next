import React from 'react'

import styles from './ui.module.css'

const Input = ({ width, height, fontSize, bg, color, ...props }) => {
	return (
		<input
			className={styles.inp}
			style={{ width: width, height: height, fontSize: fontSize, background: bg, color: color }}
			{...props}
		/>
	)
}

export default Input
