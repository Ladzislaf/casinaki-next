export const MIN_BET = 0.1;
export const MAX_BET = 999999.99;

export const MIN_CARD = 0;
export const MAX_CARD = 51;

export const overDiceCoeffs = [1.07, 1.19, 1.33, 1.52, 1.79, 2.13, 2.67, 3.56, 5.36, 10.67, 0];
export const underDiceCoeffs = [0, 10.67, 5.36, 3.56, 2.67, 2.13, 1.79, 1.52, 1.33, 1.19, 1.07];

export function getRand(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getCardValue(cardIndex: number): number {
	return Math.floor(cardIndex / 4) + 1;
}

export function getJackCardValue(cardIndex: number): number {
	if (cardIndex < 4) {
		return 11;
	} else if (cardIndex > 39) {
		return 10;
	} else {
		return Math.floor(cardIndex / 4) + 1;
	}
}

export function calcCoeff(a: number, b: number): number {
	return 0.98 / (a / b);
}

export function calcChances(a: number, b: number): string {
	return ((a / b) * 100).toFixed(2);
}

export function calcCardsSum(cards: number[]): number {
	let sum = 0;
	const cardValues: number[] = [];
	cards.forEach((el) => {
		const cardValue = getJackCardValue(el);
		sum += cardValue;
		cardValues.push(cardValue);
	});
	cardValues.forEach((el) => {
		if (el === 11 && sum > 21) {
			sum -= 10;
		}
	});
	return sum;
}

export function generateNewCard(except?: number | number[]): number {
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

export function generateUniqueCards(cardsCount: number, except?: number[]): number[] {
	let generatedCards: number[] = [];
	for (let i = 0; i < cardsCount; i++) {
		if (except) {
			generatedCards.push(generateNewCard([...generatedCards, ...except]));
		} else {
			generatedCards.push(generateNewCard(generatedCards));
		}
	}
	return generatedCards;
}

export function calcHiloCoeff(cardIndex: number, choice: 'higher' | 'lower'): number {
	const cardValue = getCardValue(cardIndex);
	if (choice === 'higher') {
		return cardValue === 1 ? 0.98 / ((13 - cardValue) / 13) : 0.98 / ((14 - cardValue) / 13);
	} else {
		return cardValue === 13 ? 0.98 / ((cardValue - 1) / 13) : 0.98 / (cardValue / 13);
	}
}

export function calcHiloChances(cardIndex: number, choice: 'higher' | 'lower'): string {
	const cardValue = getCardValue(cardIndex);
	let result: number;
	if (choice === 'higher') {
		cardValue === 1 ? (result = (13 - cardValue) / 13) : (result = (14 - cardValue) / 13);
	} else {
		cardValue === 13 ? (result = (cardValue - 1) / 13) : (result = cardValue / 13);
	}
	return (result * 100).toFixed(2);
}

export function isHiloPlayerWon(activeCardIndex: number, newCardIndex: number, choice: 'higher' | 'lower'): boolean {
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
	} else {
		if (activeCardValue === 1) {
			return newCardValue === activeCardValue;
		} else if (activeCardValue === 13) {
			return newCardValue < activeCardValue;
		} else {
			return newCardValue <= activeCardValue;
		}
	}
}

export function genMinerBombs(bombsCount: number): number[] {
	let bombsArr: number[] = [];
	while (bombsCount !== 0) {
		const bombIndex = getRand(0, 24);
		if (!bombsArr.includes(bombIndex)) {
			bombsArr.push(bombIndex);
			bombsCount--;
		}
	}
	return bombsArr;
}

export function genCardsDeck(game: 'hilo' | 'blackjack'): { index: string; suit: string; value: number }[] {
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

// *** POKER ***

export function getCardSuit(cardIndex: number): 'clubs' | 'diamonds' | 'hearts' | 'spades' {
	if (cardIndex % 4 === 0) return 'spades';
	else if (cardIndex % 4 === 1) return 'hearts';
	else if (cardIndex % 4 === 2) return 'diamonds';
	else return 'clubs';
}

export function isFlush(cards: number[]): boolean {
	const suit = getCardSuit(cards[0]);
	for (let i = 1; i < cards.length; i++) {
		if (getCardSuit(cards[i]) !== suit) return false;
	}
	return true;
}

export function isStraight(sortedCardValues: number[]): boolean {
	if (sortedCardValues[0] === 1) {
		const straight1: boolean =
			sortedCardValues[1] === 2 && sortedCardValues[2] === 3 && sortedCardValues[3] === 4 && sortedCardValues[4] === 5;
		const straight2: boolean =
			sortedCardValues[1] === 10 &&
			sortedCardValues[2] === 11 &&
			sortedCardValues[3] === 12 &&
			sortedCardValues[4] === 13;
		return straight1 || straight2;
	} else {
		let currValue = sortedCardValues[0];
		for (let i = 1; i < sortedCardValues.length; i++) {
			if (sortedCardValues[i] !== currValue + 1) return false;
			currValue = sortedCardValues[i];
		}
		return true;
	}
}

export function isFour(sortedCardValues: number[]): boolean {
	const four1: boolean =
		sortedCardValues[0] === sortedCardValues[1] &&
		sortedCardValues[1] === sortedCardValues[2] &&
		sortedCardValues[2] === sortedCardValues[3];
	const four2: boolean =
		sortedCardValues[1] === sortedCardValues[2] &&
		sortedCardValues[2] === sortedCardValues[3] &&
		sortedCardValues[3] === sortedCardValues[4];
	return four1 || four2;
}

export function isFullHouse(sortedCardValues: number[]): boolean {
	const fullHouse1: boolean =
		sortedCardValues[0] === sortedCardValues[1] &&
		sortedCardValues[2] === sortedCardValues[3] &&
		sortedCardValues[3] === sortedCardValues[4];
	const fullHouse2: boolean =
		sortedCardValues[0] === sortedCardValues[1] &&
		sortedCardValues[1] === sortedCardValues[2] &&
		sortedCardValues[3] === sortedCardValues[4];
	return fullHouse1 || fullHouse2;
}

export function isThree(sortedCardValues: number[]): boolean {
	const three1: boolean = sortedCardValues[0] === sortedCardValues[1] && sortedCardValues[1] === sortedCardValues[2];
	const three2: boolean = sortedCardValues[1] === sortedCardValues[2] && sortedCardValues[2] === sortedCardValues[3];
	const three3: boolean = sortedCardValues[2] === sortedCardValues[3] && sortedCardValues[3] === sortedCardValues[4];
	return three1 || three2 || three3;
}

export function isTwoPairs(sortedCardValues: number[]): boolean {
	const twoPairs1: boolean = sortedCardValues[0] === sortedCardValues[1] && sortedCardValues[2] === sortedCardValues[3];
	const twoPairs2: boolean = sortedCardValues[1] === sortedCardValues[2] && sortedCardValues[3] === sortedCardValues[4];
	const twoPairs3: boolean = sortedCardValues[0] === sortedCardValues[1] && sortedCardValues[3] === sortedCardValues[4];
	return twoPairs1 || twoPairs2 || twoPairs3;
}

export function isPair(sortedCardValues: number[]): boolean {
	const pair1: boolean = sortedCardValues[0] === sortedCardValues[1];
	const pair2: boolean = sortedCardValues[1] === sortedCardValues[2];
	const pair3: boolean = sortedCardValues[2] === sortedCardValues[3];
	const pair4: boolean = sortedCardValues[3] === sortedCardValues[4];
	return pair1 || pair2 || pair3 || pair4;
}

type pokerResults =
	| 'royalFlush'
	| 'straightFlush'
	| 'four'
	| 'fullHouse'
	| 'flush'
	| 'straight'
	| 'three'
	| 'twoPair'
	| 'pair'
	| 'nothing';

export function checkPokerGame(cards: number[]): pokerResults {
	if (cards.length !== 5) return 'nothing';
	const cardValues: number[] = [];
	cards.forEach((el) => {
		cardValues.push(getCardValue(el));
	});
	cardValues.sort((a, b) => a - b);
	if (isFlush(cards) && isStraight(cardValues) && cardValues[0] === 1 && cardValues[4] === 13) return 'royalFlush';
	else if (isFlush(cards) && isStraight(cardValues)) return 'straightFlush';
	else if (isFour(cardValues)) return 'four';
	else if (isFullHouse(cardValues)) return 'fullHouse';
	else if (isFlush(cards)) return 'flush';
	else if (isStraight(cardValues)) return 'straight';
	else if (isThree(cardValues)) return 'three';
	else if (isTwoPairs(cardValues)) return 'twoPair';
	else if (isPair(cardValues)) return 'pair';
	else return 'nothing';
}

// export async function updateRank(profile) {
// 	const ranks = await Rank.findAll();
// 	let rankId = 1;
// 	for (let i = 0; i < ranks.length; i++) {
// 		if (profile.winnings_sum >= ranks[i].dataValues.value_to_achieve) rankId = i + 1;
// 	}
// 	if (profile.rankId !== rankId) await profile.update({ rankId: rankId });
// }
