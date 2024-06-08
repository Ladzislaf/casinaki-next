'use client';
import React from 'react';
import { genCardsDeck } from '@/lib/utils';
import clsx from 'clsx';

const cardsDeck = genCardsDeck('hilo');

export default function Card({
	cardIndex,
	className,
	onClick,
	cardWidth,
	cardHeigth,
	cardColor,
	children,
}: {
	cardIndex: number;
	className?: string;
	onClick?: () => void;
	cardWidth?: string;
	cardHeigth?: string;
	cardColor?: string;
	children?: string;
}) {
	if (cardIndex < 0 || cardIndex > 51) {
		cardIndex = 52;
	}
	const currentCard = cardsDeck[cardIndex];
	let cardBg = '#085b00';

	if (currentCard.suit === '♥' || currentCard.suit === '♦') {
		cardBg = '#981d1d';
	} else if (currentCard.suit === '♠' || currentCard.suit === '♣') {
		cardBg = '#021800';
	}

	return cardIndex === 52 ? (
		<div className={'card'} style={{ background: cardBg, width: cardWidth, height: cardHeigth }}>
			<div>*</div>
		</div>
	) : (
		<div
			key={cardIndex}
			className={clsx('card', className)}
			onClick={onClick}
			style={{
				background: cardColor ? cardColor : cardBg,
				width: cardWidth,
				height: cardHeigth,
			}}
		>
			<div>
				{currentCard.index + currentCard.suit}
				<p style={{ fontSize: '1.5rem' }}>{children}</p>
			</div>
		</div>
	);
}
