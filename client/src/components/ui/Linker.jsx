import React from 'react'

import styles from './ui.module.css'
import { NavLink } from 'react-router-dom'

const Linker = ({ children, circled, color, ...props }) => {
	return (
		<NavLink
			className={styles.linker}
			style={{
				borderRadius: circled && '50%',
				color: color,
			}}
			{...props}
		>
            {children}
		</NavLink>
	)
}

export default Linker
