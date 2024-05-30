export const MIN_BET = 0.1;
export const MAX_BET = 999999.99;

export const MIN_CARD = 0;
export const MAX_CARD = 51;

export const overDiceCoeffs = [1.07, 1.19, 1.33, 1.52, 1.79, 2.13, 2.67, 3.56, 5.36, 10.67, 0];
export const underDiceCoeffs = [0, 10.67, 5.36, 3.56, 2.67, 2.13, 1.79, 1.52, 1.33, 1.19, 1.07];

export function getRand(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getCardValue(cardIndex: number) {
	return Math.floor(cardIndex / 4) + 1;
}

export function calcCoeff(a: number, b: number): number {
	return 0.98 / (a / b);
}

export function generateNewCard(except?: number | number[]) {
	let newCardIndex = getRand(0, 51);
	if (typeof except === 'number') {
		while (newCardIndex === except) {
			newCardIndex = getRand(0, 51);
		}
	} else if (except) {
		while (except.includes(newCardIndex)) {
			newCardIndex = getRand(0, 51);
		}
	}
	return newCardIndex;
}

export function calcHiloCoeff(cardIndex: number, choice: 'higher' | 'lower'): number {
	const cardValue = getCardValue(cardIndex);
	if (choice === 'higher') {
		return cardValue === 1 ? 0.98 / ((13 - cardValue) / 13) : 0.98 / ((14 - cardValue) / 13);
	} else {
		return cardValue === 13 ? 0.98 / ((cardValue - 1) / 13) : 0.98 / (cardValue / 13);
	}
}

export function isHiloPlayerWon(activeCardIndex: number, newCardIndex: number, choice: 'higher' | 'lower') {
	const activeCardValue = getCardValue(activeCardIndex);
	const newCardValue = getCardValue(newCardIndex);

	if (choice === 'higher') {
		if (activeCardValue === 1) {
			return newCardValue > activeCardValue;
		} else if (activeCardValue === 13) {
			return newCardValue === activeCardValue;
		} else {
			return newCardValue >= activeCardValue;
		}
	} else if (choice === 'lower') {
		if (activeCardValue === 1) {
			return newCardValue === activeCardValue;
		} else if (activeCardValue === 13) {
			return newCardValue < activeCardValue;
		} else {
			return newCardValue <= activeCardValue;
		}
	}
}

// export async function updateRank(profile) {
// 	const ranks = await Rank.findAll();
// 	let rankId = 1;
// 	for (let i = 0; i < ranks.length; i++) {
// 		if (profile.winnings_sum >= ranks[i].dataValues.value_to_achieve) rankId = i + 1;
// 	}
// 	if (profile.rankId !== rankId) await profile.update({ rankId: rankId });
// }

// export function getBlackJackCardValue(cardIndex) {
// 	const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
// 	let cards = Array(52);

// 	for (let i = 0; i < cards.length; i++) {
// 		cards[i] = values[Math.floor(i / 4)];
// 	}

// 	return cards[cardIndex];
// }

export function genMinerBombs(bombsCount: number) {
	let bombsArr: number[] = [];
	while (bombsCount !== 0) {
		const bomb = getRand(1, 25);
		if (!bombsArr.includes(bomb)) {
			bombsArr.push(bomb);
			bombsCount--;
		}
	}
	return bombsArr;
}

export function genCardsDeck(game: 'hilo' | 'blackjack') {
	const suits = ['♠', '♥', '♦', '♣'];
	const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
	const values = {
		hilo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
		blackjack: [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10],
	};
	const cards: { index: string; suit: string; value: number }[] = [];

	for (let i = 0; i < ranks.length; i++) {
		for (let suit of suits) {
			cards.push({ index: ranks[i], suit: suit, value: values[game][i] });
		}
	}
	cards.push({ index: 'joker', suit: '', value: 0 });

	return cards;
}
