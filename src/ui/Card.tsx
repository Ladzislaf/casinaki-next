'use client';
import React from 'react';
import { genCardsDeck } from '@/lib/utils';

const cardsDeck = genCardsDeck('hilo');

export default function Card({
	cardIndex,
	cardWidth,
	cardHeigth,
}: {
	cardIndex: number;
	cardWidth?: string;
	cardHeigth?: string;
}) {
	if (cardIndex < 0 || cardIndex > 51) {
		cardIndex = 52;
	}

	const currentCard = cardsDeck[cardIndex];

	return cardIndex === 52 ? (
		<div className='card' style={{ background: '#085b00', width: cardWidth, height: cardHeigth }}>
			*
		</div>
	) : (
		<div
			className='card'
			style={{
				background: currentCard.index[1] === '♥' || currentCard.index[1] === '♦' ? '#981d1d' : '#021800',
				width: cardWidth,
				height: cardHeigth,
			}}
		>
			{currentCard.index}
		</div>
	);
}
