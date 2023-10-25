import React from 'react'

import styles from './ui.module.css'

const Button = ({ children, bg, width, height, ...props }) => {
	return (
		<button className={styles.btn} style={{ background: bg, width: width, height: height }} {...props}>{children}</button>
	)
}

export default Button