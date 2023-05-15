import React from 'react'

import styles from './Button.module.css'

const Button = ({ children, onClick, width, height, fontSize, padding, disabled }) => {
	return (
		<button className={styles.btn} onClick={onClick} style={{ width: width, height: height, fontSize: fontSize, padding: padding }} disabled={disabled}>{children}</button>
	)
}

export default Button