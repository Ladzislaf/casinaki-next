import React from 'react'
import styles from './Card.module.css'
import { getCardsDeck } from '../../utils/functions'

const cardsDeck = getCardsDeck()

const Card = ({ cardIndex }) => {
    if (cardIndex < 0 || cardIndex > 51) {
        cardIndex = 52
    }

    const currentCard = cardsDeck[cardIndex]

    return (
        (cardIndex === 52) ?
        <div className={styles.card} style={{ background: 'green' }}></div>
        :
		<div className={styles.card} style={{ background: currentCard.key[1] === '♥' || currentCard.key[1] === '♦' ? 'red' : 'black' }}>
			{currentCard.key}
		</div>
	)
}

export default Card