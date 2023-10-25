import React from 'react'

import styles from './ui.module.css'

const Heading = ({ children, color, ...props }) => {
	return (
		<div className={styles.heading} style={{ color: color }} {...props}>{children}</div>
	)
}

export default Heading