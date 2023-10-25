import React from 'react'

import styles from './ui.module.css'

const InputArea = ({ children, width, height, fontSize, bg, color, ...props }) => {
	return (
		<textarea
			className={styles.inpArea}
			style={{ width: width, height: height, fontSize: fontSize, background: bg, color: color }}
			{...props}
		>
            {children}
        </textarea>
	)
}

export default InputArea
