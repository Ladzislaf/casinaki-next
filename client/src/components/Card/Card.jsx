import React from 'react'
import styles from './Card.module.css'
import { getCardsDeck } from '../../utils/functions'
import { GREEN_BTN_COLOR } from '../../utils/constants'

const cardsDeck = getCardsDeck()

const Card = ({ cardIndex, scale, ...props }) => {
	scale = scale || 1
	
	if (cardIndex < 0 || cardIndex > 51) {
		cardIndex = 52
	}

	const currentCard = cardsDeck[cardIndex]

	return (
		<div
			className={styles.card}
			style={{
				background:
					cardIndex === 52
						? GREEN_BTN_COLOR
						: currentCard.index[2] === '♥' || currentCard.index[2] === '♦'
						? '#981d1d'
						: '#021800',
				width: (scale * 7).toFixed(2) + 'rem',
				height: (scale * 9).toFixed(2) + 'rem',
			}}
			{...props}
		>
			<span style={{ fontSize: (scale * 2.2).toFixed(2) + 'rem' }}>
				{cardIndex === 52 ? '*' : currentCard.index}
			</span>
		</div>
	)
}

export default Card
