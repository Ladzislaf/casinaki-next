 import React from 'react'

import styles from './Button.module.css'

const Button = ({ children, onClick, width, height, fontSize, padding, disabled, bg, color }) => {
	return (
		<button className={styles.btn} onClick={onClick} style={{ width: width, height: height, fontSize: fontSize, padding: padding, background: bg, color: color }} disabled={disabled}>{children}</button>
	)
}

export default Button