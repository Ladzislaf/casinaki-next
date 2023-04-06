import React from 'react'

import styles from './Button.module.css'

const Button = ({ children, onClick, width, height, disabled }) => {
	return (
		<button className={styles.btn} onClick={onClick} style={{ width: width, height: height }} disabled={disabled}>{children}</button>
	)
}

export default Button